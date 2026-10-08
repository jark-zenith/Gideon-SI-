import type { AnyTool } from '../tools/types.js';

export type PolicyOutcome = 'ALLOW' | 'DENY' | 'REQUIRE_CONFIRMATION';
export interface PolicyDecision {
  outcome: PolicyOutcome;
  reason: string;
}

export interface PolicyInput {
  tool: AnyTool | undefined;
  grantedScopes: ReadonlySet<string>;
  /** True if any external/untrusted content is currently in the model's context. */
  untrustedInContext: boolean;
  /** True only if a valid, unexpired, single-use confirmation bound to THIS exact call was consumed. */
  confirmationValid: boolean;
}

/**
 * Deterministic policy. Pure function: no model output, rationale text or retrieved content
 * can influence it other than through the typed inputs above. Deny by default.
 */
export function decide(input: PolicyInput): PolicyDecision {
  const { tool } = input;
  if (!tool) return { outcome: 'DENY', reason: 'unknown_tool' };

  const missing = tool.requiredScopes.filter((s) => !input.grantedScopes.has(s));
  if (missing.length > 0) return { outcome: 'DENY', reason: `missing_scope:${missing.join(',')}` };

  switch (tool.riskTier) {
    case 'HIGH_RISK':
      return { outcome: 'DENY', reason: 'high_risk_never_automatic' };
    case 'SENSITIVE':
      return input.confirmationValid
        ? { outcome: 'ALLOW', reason: 'sensitive_confirmed' }
        : { outcome: 'REQUIRE_CONFIRMATION', reason: 'sensitive_requires_confirmation' };
    case 'REVERSIBLE':
      if (input.untrustedInContext && !input.confirmationValid)
        return { outcome: 'REQUIRE_CONFIRMATION', reason: 'reversible_after_untrusted_content' };
      return { outcome: 'ALLOW', reason: input.confirmationValid ? 'reversible_confirmed' : 'reversible_granted' };
    case 'INFORMATION':
      return { outcome: 'ALLOW', reason: 'information_granted' };
    default:
      return { outcome: 'DENY', reason: 'unrecognized_risk_tier' };
  }
}
