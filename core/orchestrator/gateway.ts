import type { ToolProposal } from '../models/types.js';
import { redactDeep, redactSecrets } from '../security/redact.js';
import { canonicalize } from '../security/canonical.js';
import { ConfirmationStore } from '../security/confirmations.js';
import { decide } from '../security/policy.js';
import type { AuditEntry, AuditLogger } from '../security/audit.js';
import type { ToolRegistry } from '../tools/registry.js';
import type { SessionContext } from '../tools/types.js';

export type GatewayOutcome =
  | { status: 'ok'; tool: string; data: unknown; provenance: { source: string; untrusted: true } }
  | { status: 'denied'; tool: string; reason: string }
  | { status: 'confirmation_required'; tool: string; confirmationId: string; args: unknown; expiresAt: number }
  | { status: 'error'; tool: string; code: string; message: string };

export interface HandleOptions {
  untrustedInContext: boolean;
  /** Supplied by the client after an explicit user action. */
  confirmationId?: string;
}

class ToolTimeoutError extends Error {}

/**
 * The ONLY path from a model's proposal to a tool execution:
 * PROPOSAL → validate → POLICY → (CONFIRMATION) → TOOL → AUDIT.   (ADR-002)
 * Fails closed: if an audit record cannot be written, nothing executes.
 */
export class ToolGateway {
  constructor(
    private readonly registry: ToolRegistry,
    private readonly audit: AuditLogger,
    private readonly confirmations: ConfirmationStore,
  ) {}

  async handle(ctx: SessionContext, proposal: ToolProposal, opts: HandleOptions): Promise<GatewayOutcome> {
    const toolName = typeof proposal.tool === 'string' ? proposal.tool : '<invalid>';
    const base = (extra: Partial<AuditEntry> & Pick<AuditEntry, 'type'>): AuditEntry => ({
      userId: ctx.userId,
      sessionId: ctx.sessionId,
      tool: toolName,
      argsHash: ConfirmationStore.hashArgs(proposal.args),
      argsRedacted: safeArgsPreview(proposal.args),
      ...extra,
    });

    try {
      await this.audit.append(base({ type: 'proposal' }));
    } catch {
      return { status: 'error', tool: toolName, code: 'audit_unavailable', message: 'Audit log unavailable; action not executed.' };
    }

    const tool = this.registry.get(toolName);
    let parsedArgs: unknown = undefined;
    let inputOk = false;
    if (tool) {
      const parsed = tool.inputSchema.safeParse(proposal.args);
      if (parsed.success) {
        parsedArgs = parsed.data;
        inputOk = true;
      }
    }

    if (tool && !inputOk) return this.deny(ctx, base, toolName, 'invalid_input');

    const confirmationValid =
      tool && inputOk && opts.confirmationId ? this.confirmations.consume(opts.confirmationId, ctx, toolName, parsedArgs) : false;

    const decision = decide({ tool, grantedScopes: ctx.scopes, untrustedInContext: opts.untrustedInContext, confirmationValid });

    try {
      await this.audit.append(base({ type: 'decision', decision: decision.outcome, reason: decision.reason, confirmationId: confirmationValid ? opts.confirmationId : undefined }));
    } catch {
      return { status: 'error', tool: toolName, code: 'audit_unavailable', message: 'Audit log unavailable; action not executed.' };
    }

    if (decision.outcome === 'DENY' || !tool) return { status: 'denied', tool: toolName, reason: decision.reason };

    if (decision.outcome === 'REQUIRE_CONFIRMATION') {
      const c = this.confirmations.request(ctx, toolName, parsedArgs);
      try {
        await this.audit.append(base({ type: 'confirmation_requested', confirmationId: c.id }));
      } catch {
        return { status: 'error', tool: toolName, code: 'audit_unavailable', message: 'Audit log unavailable; action not executed.' };
      }
      return { status: 'confirmation_required', tool: toolName, confirmationId: c.id, args: parsedArgs, expiresAt: c.expiresAt };
    }

    return this.execute(ctx, base, tool, parsedArgs);
  }

  private async deny(ctx: SessionContext, base: (e: Partial<AuditEntry> & Pick<AuditEntry, 'type'>) => AuditEntry, toolName: string, reason: string): Promise<GatewayOutcome> {
    try {
      await this.audit.append(base({ type: 'decision', decision: 'DENY', reason }));
    } catch {
      return { status: 'error', tool: toolName, code: 'audit_unavailable', message: 'Audit log unavailable; action not executed.' };
    }
    return { status: 'denied', tool: toolName, reason };
  }

  private async execute(
    ctx: SessionContext,
    base: (e: Partial<AuditEntry> & Pick<AuditEntry, 'type'>) => AuditEntry,
    tool: NonNullable<ReturnType<ToolRegistry['get']>>,
    args: unknown,
  ): Promise<GatewayOutcome> {
    const started = Date.now();
    let outcome: GatewayOutcome;
    let errorCode: string | undefined;
    let summary: string | undefined;

    try {
      const raw = await withTimeout((signal) => tool.execute(ctx, args, signal), tool.limits.timeoutMs);
      const out = tool.outputSchema.safeParse(raw);
      if (!out.success) {
        errorCode = 'invalid_output';
        outcome = { status: 'error', tool: tool.name, code: errorCode, message: 'Tool produced output that failed validation.' };
      } else {
        const redacted = redactDeep(out.data);
        const bytes = Buffer.byteLength(JSON.stringify(redacted) ?? '', 'utf8');
        if (bytes > tool.limits.maxOutputBytes) {
          errorCode = 'output_too_large';
          outcome = { status: 'error', tool: tool.name, code: errorCode, message: `Output exceeded ${tool.limits.maxOutputBytes} bytes.` };
        } else {
          summary = `ok, ${bytes} bytes`;
          outcome = { status: 'ok', tool: tool.name, data: redacted, provenance: { source: `tool:${tool.name}`, untrusted: true } };
        }
      }
    } catch (e) {
      errorCode = e instanceof ToolTimeoutError ? 'timeout' : 'tool_error';
      const msg = e instanceof ToolTimeoutError ? 'Tool timed out.' : 'Tool failed.';
      summary = redactSecrets(e instanceof Error ? e.message : String(e)).slice(0, 200);
      outcome = { status: 'error', tool: tool.name, code: errorCode, message: msg };
    }

    try {
      await this.audit.append(
        base({ type: 'execution', status: outcome.status === 'ok' ? 'ok' : 'error', errorCode, durationMs: Date.now() - started, resultSummary: summary }),
      );
    } catch {
      // The action may already have happened. Be honest about it instead of reporting plain success.
      return { status: 'error', tool: tool.name, code: 'audit_failed_after_execution', message: 'The tool ran but its audit record could not be written.' };
    }
    return outcome;
  }
}

function safeArgsPreview(args: unknown): string {
  try {
    return redactSecrets(canonicalize(args)).slice(0, 500);
  } catch {
    return '[unserializable]';
  }
}

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const ac = new AbortController();
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      ac.abort();
      reject(new ToolTimeoutError());
    }, ms);
  });
  try {
    return await Promise.race([fn(ac.signal), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
