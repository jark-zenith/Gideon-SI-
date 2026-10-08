import { z } from 'zod';
import type { GideonTool } from './types.js';

const input = z.object({ text: z.string().min(1).max(500) }).strict();
const output = z.object({ echoed: z.string() });

/**
 * Real, deliberately trivial diagnostic tool. Its only purpose is to prove the
 * proposal → policy → execute → audit loop end to end. It does not touch any external system.
 */
export const diagnosticsEcho: GideonTool<z.infer<typeof input>, z.infer<typeof output>> = {
  name: 'diagnostics.echo',
  description: 'Diagnostic: returns the text it was given. Used to verify the tool pipeline.',
  inputSchema: input,
  outputSchema: output,
  riskTier: 'INFORMATION',
  requiredScopes: ['diagnostics:use'],
  limits: { timeoutMs: 2_000, maxOutputBytes: 2_000 },
  async execute(_ctx, { text }) {
    return { echoed: text };
  },
};
