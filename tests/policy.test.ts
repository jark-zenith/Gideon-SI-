import { describe, expect, it } from "vitest";
import { evaluateToolProposal } from "../src/core/policy.js";
import type { ToolCallProposal, ToolDefinition } from "../src/core/types.js";

const sensitiveTool: ToolDefinition = {
  name: "send-email",
  description: "Send an email.",
  actionTier: "sensitive",
  inputSchema: {},
};

const proposal: ToolCallProposal = {
  toolName: "send-email",
  arguments: { to: "example@example.com" },
  reason: "User requested an email.",
};

describe("GIDEON policy boundary", () => {
  it("requires confirmation for sensitive actions", () => {
    const decision = evaluateToolProposal(proposal, sensitiveTool, false);

    expect(decision.allowed).toBe(false);
    expect(decision.requiresConfirmation).toBe(true);
  });

  it("allows a confirmed sensitive action", () => {
    const decision = evaluateToolProposal(proposal, sensitiveTool, true);

    expect(decision.allowed).toBe(true);
    expect(decision.requiresConfirmation).toBe(false);
  });
});
