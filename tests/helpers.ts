import { z } from 'zod';
import {
  ConfirmationStore, GideonCore, InMemoryAuditLog, ModelRouter, ToolGateway, ToolRegistry,
  type AuditLogger, type GenerateRequest, type GenerateResponse, type GideonTool, type ModelProvider,
  type RiskTier, type SessionContext, type ToolProposal,
} from '../core/index.js';

/** TEST ONLY. A scripted stand-in for a model so we can simulate a (possibly compromised) model. Never used in production code. */
export class ScriptedProvider implements ModelProvider {
  readonly id = 'test-scripted';
  readonly requests: GenerateRequest[] = [];
  constructor(private readonly script: Array<(req: GenerateRequest) => Partial<GenerateResponse>>) {}
  capabilities() { return { toolCalling: true, vision: false, streaming: false }; }
  async generate(req: GenerateRequest): Promise<GenerateResponse> {
    this.requests.push(req);
    const step = this.script[Math.min(this.requests.length - 1, this.script.length - 1)]!;
    return { text: '', proposals: [], providerId: this.id, ...step(req) };
  }
}

export const ctxFor = (userId = 'user-a', scopes: string[] = ['diagnostics:use', 'test:use'], sessionId = 'sess-1'): SessionContext => ({
  userId, sessionId, scopes: new Set(scopes),
});

export function makeTool(opts: {
  name: string; tier: RiskTier; scopes?: string[]; calls?: { n: number };
  run?: (signal: AbortSignal) => Promise<unknown>; timeoutMs?: number; maxBytes?: number;
}): GideonTool<{ v: string }, unknown> {
  return {
    name: opts.name,
    description: `test tool ${opts.name}`,
    inputSchema: z.object({ v: z.string() }).strict(),
    outputSchema: z.unknown(),
    riskTier: opts.tier,
    requiredScopes: opts.scopes ?? ['test:use'],
    limits: { timeoutMs: opts.timeoutMs ?? 1000, maxOutputBytes: opts.maxBytes ?? 10_000 },
    async execute(_c, input, signal) {
      if (opts.calls) opts.calls.n++;
      return opts.run ? opts.run(signal) : { done: input.v };
    },
  };
}

export function build(tools: Array<GideonTool<any, any>>, audit: AuditLogger = new InMemoryAuditLog()) {
  const registry = new ToolRegistry();
  tools.forEach((t) => registry.register(t));
  const confirmations = new ConfirmationStore();
  const gateway = new ToolGateway(registry, audit, confirmations);
  return { registry, gateway, confirmations, audit };
}

export function buildCore(tools: Array<GideonTool<any, any>>, provider: ModelProvider) {
  const b = build(tools);
  const router = new ModelRouter();
  router.register(provider);
  const core = new GideonCore({ router, registry: b.registry, gateway: b.gateway });
  return { ...b, core, router };
}

export const proposal = (tool: string, args: unknown, id = 'p1'): ToolProposal => ({ id, tool, args });
