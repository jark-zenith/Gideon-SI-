export type ActionTier = "information" | "reversible" | "sensitive" | "high-risk";

export interface GideonMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export interface GideonContext {
  userId: string;
  sessionId: string;
  messages: GideonMessage[];
}

export interface ModelRequest {
  context: GideonContext;
  tools?: ToolDefinition[];
}

export interface ModelResponse {
  text: string;
  proposedToolCalls: ToolCallProposal[];
  provider: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  actionTier: ActionTier;
  inputSchema: Record<string, unknown>;
}

export interface ToolCallProposal {
  toolName: string;
  arguments: Record<string, unknown>;
  reason: string;
}

export interface ToolResult {
  toolName: string;
  ok: boolean;
  data?: unknown;
  error?: string;
}

export interface AuditEvent {
  type: "tool.proposed" | "tool.denied" | "tool.executed" | "tool.failed";
  userId: string;
  sessionId: string;
  toolName: string;
  actionTier: ActionTier;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
