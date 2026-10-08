export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCallId?: string;
  untrusted?: boolean;
}

export interface ToolSpec {
  name: string;
  description: string;
  inputJsonSchema: Record<string, unknown>;
}

export interface ToolProposal {
  id: string;
  tool: string;
  args: unknown;
}

export interface GenerateRequest {
  messages: Message[];
  tools: ToolSpec[];
}

export interface GenerateResponse {
  text: string;
  proposals: ToolProposal[];
  providerId: string;
}

export interface ModelCapabilities {
  toolCalling: boolean;
  vision: boolean;
  streaming: boolean;
}

export interface ModelProvider {
  readonly id: string;
  capabilities(): ModelCapabilities;
  generate(request: GenerateRequest): Promise<GenerateResponse>;
}
