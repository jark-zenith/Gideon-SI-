import type { ActionTier, AuditEvent, ToolCallProposal, ToolDefinition } from "./types.js";

export interface PolicyDecision {
  allowed: boolean;
  requiresConfirmation: boolean;
  reason: string;
}

const riskOrder: Record<ActionTier, number> = {
  information: 0,
  reversible: 1,
  sensitive: 2,
  "high-risk": 3,
};

export function evaluateToolProposal(
  proposal: ToolCallProposal,
  definition: ToolDefinition,
  confirmed: boolean,
): PolicyDecision {
  if (proposal.toolName !== definition.name) {
    return {
      allowed: false,
      requiresConfirmation: false,
      reason: "Tool proposal does not match the registered tool.",
    };
  }

  const requiresConfirmation = riskOrder[definition.actionTier] >= riskOrder.sensitive;

  if (requiresConfirmation && !confirmed) {
    return {
      allowed: false,
      requiresConfirmation: true,
      reason: "Explicit user confirmation is required for this action tier.",
    };
  }

  return {
    allowed: true,
    requiresConfirmation: false,
    reason: "Policy checks passed.",
  };
}

export function createAuditEvent(
  type: AuditEvent["type"],
  userId: string,
  sessionId: string,
  proposal: ToolCallProposal,
  definition: ToolDefinition,
  metadata?: Record<string, unknown>,
): AuditEvent {
  return {
    type,
    userId,
    sessionId,
    toolName: definition.name,
    actionTier: definition.actionTier,
    timestamp: new Date().toISOString(),
    ...(metadata ? { metadata } : {}),
  };
}
