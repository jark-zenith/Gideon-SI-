import type { GideonModelProvider } from "./provider.js";
import { createAuditEvent, evaluateToolProposal } from "./policy.js";
import type { GideonContext, ToolDefinition, ToolResult, AuditEvent } from "./types.js";

export interface ToolExecutor {
  execute(
    tool: ToolDefinition,
    input: Record<string, unknown>,
    context: GideonContext,
  ): Promise<ToolResult>;
}

export interface GideonTurnResult {
  response: string;
  toolResults: ToolResult[];
  auditEvents: AuditEvent[];
}

export class GideonCore {
  constructor(
    private readonly provider: GideonModelProvider,
    private readonly tools: Map<string, ToolDefinition>,
    private readonly executor: ToolExecutor,
  ) {}

  async runTurn(
    context: GideonContext,
    confirmedToolNames: ReadonlySet<string> = new Set(),
  ): Promise<GideonTurnResult> {
    const model = await this.provider.generate({
      context,
      tools: [...this.tools.values()],
    });

    const auditEvents: AuditEvent[] = [];
    const toolResults: ToolResult[] = [];

    for (const proposal of model.proposedToolCalls) {
      const definition = this.tools.get(proposal.toolName);

      if (!definition) {
        continue;
      }

      auditEvents.push(
        createAuditEvent(
          "tool.proposed",
          context.userId,
          context.sessionId,
          proposal,
          definition,
        ),
      );

      const decision = evaluateToolProposal(
        proposal,
        definition,
        confirmedToolNames.has(definition.name),
      );

      if (!decision.allowed) {
        auditEvents.push(
          createAuditEvent(
            "tool.denied",
            context.userId,
            context.sessionId,
            proposal,
            definition,
            { reason: decision.reason },
          ),
        );
        continue;
      }

      const result = await this.executor.execute(
        definition,
        proposal.arguments,
        context,
      );

      toolResults.push(result);

      auditEvents.push(
        createAuditEvent(
          result.ok ? "tool.executed" : "tool.failed",
          context.userId,
          context.sessionId,
          proposal,
          definition,
          result.ok ? undefined : { error: result.error },
        ),
      );
    }

    return {
      response: model.text,
      toolResults,
      auditEvents,
    };
  }
}
