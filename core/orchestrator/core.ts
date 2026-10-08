import type { Message } from '../models/types.js';
import type { ModelRouter } from '../models/router.js';
import type { ToolRegistry } from '../tools/registry.js';
import type { SessionContext } from '../tools/types.js';
import { ContextManager, wrapUntrusted } from './context.js';
import type { GatewayOutcome, ToolGateway } from './gateway.js';

export interface TurnResult {
  text: string;
  /** Messages produced this turn, to be appended to the conversation history by the caller. */
  newMessages: Message[];
  outcomes: GatewayOutcome[];
  stoppedReason: 'complete' | 'confirmation_required' | 'max_steps';
  pendingConfirmation?: Extract<GatewayOutcome, { status: 'confirmation_required' }>;
}

export interface GideonCoreDeps {
  router: ModelRouter;
  registry: ToolRegistry;
  gateway: ToolGateway;
  context?: ContextManager;
  maxSteps?: number;
}

/**
 * GIDEON Core (Phase 1 skeleton). Text turns only. NOT YET IMPLEMENTED here: streaming, memory,
 * voice, claim-vs-audit verification in the Safety Layer.
 */
export class GideonCore {
  private readonly context: ContextManager;
  private readonly maxSteps: number;

  constructor(private readonly deps: GideonCoreDeps) {
    this.context = deps.context ?? new ContextManager();
    this.maxSteps = deps.maxSteps ?? 4;
  }

  async handleTurn(ctx: SessionContext, history: readonly Message[], userText: string): Promise<TurnResult> {
    const messages = this.context.build(history, userText);
    const newMessages: Message[] = [{ role: 'user', content: userText }];
    const outcomes: GatewayOutcome[] = [];
    const tools = this.deps.registry.specs();
    const provider = this.deps.router.select({ needsTools: tools.length > 0 });

    for (let step = 0; step < this.maxSteps; step++) {
      const res = await provider.generate({ messages, tools });
      const assistant: Message = { role: 'assistant', content: res.text };
      messages.push(assistant);
      newMessages.push(assistant);

      if (res.proposals.length === 0) return { text: res.text, newMessages, outcomes, stoppedReason: 'complete' };

      for (const proposal of res.proposals) {
        const untrustedInContext = messages.some((m) => m.untrusted === true);
        const outcome = await this.deps.gateway.handle(ctx, proposal, { untrustedInContext });
        outcomes.push(outcome);

        if (outcome.status === 'confirmation_required') {
          return { text: res.text, newMessages, outcomes, stoppedReason: 'confirmation_required', pendingConfirmation: outcome };
        }

        const toolMsg: Message = {
          role: 'tool',
          toolCallId: proposal.id,
          untrusted: true,
          content: wrapUntrusted(`tool:${outcome.tool}`, JSON.stringify(summarize(outcome))),
        };
        messages.push(toolMsg);
        newMessages.push(toolMsg);
      }
    }
    return { text: 'Stopped: too many tool steps in one turn.', newMessages, outcomes, stoppedReason: 'max_steps' };
  }

  /** Called when the USER explicitly confirms in the client. The confirmation is validated by the gateway. */
  async confirm(ctx: SessionContext, pending: { tool: string; args: unknown }, confirmationId: string, untrustedInContext: boolean): Promise<GatewayOutcome> {
    return this.deps.gateway.handle(ctx, { id: `confirm-${confirmationId}`, tool: pending.tool, args: pending.args }, { untrustedInContext, confirmationId });
  }
}

function summarize(o: GatewayOutcome): unknown {
  switch (o.status) {
    case 'ok':
      return { status: 'ok', data: o.data };
    case 'denied':
      return { status: 'denied', reason: o.reason };
    case 'error':
      return { status: 'error', code: o.code, message: o.message };
    default:
      return { status: o.status };
  }
}
