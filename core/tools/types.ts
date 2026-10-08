import type { ZodType } from 'zod';

export type RiskTier = 'INFORMATION' | 'REVERSIBLE' | 'SENSITIVE' | 'HIGH_RISK';

/** Established by Gateway/Auth from verified identity. NEVER derived from model output or client claims. */
export interface SessionContext {
  userId: string;
  sessionId: string;
  scopes: ReadonlySet<string>;
}

export interface GideonTool<I = unknown, O = unknown> {
  name: string;
  description: string;
  inputSchema: ZodType<I>;
  outputSchema: ZodType<O>;
  riskTier: RiskTier;
  requiredScopes: string[];
  limits: { timeoutMs: number; maxOutputBytes: number };
  execute(ctx: SessionContext, input: I, signal: AbortSignal): Promise<O>;
}

export type AnyTool = GideonTool<any, any>;
