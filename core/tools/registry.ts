import { z } from 'zod';
import type { ToolSpec } from '../models/types.js';
import type { AnyTool } from './types.js';

const NAME_RE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/;

export class ToolRegistry {
  private readonly tools = new Map<string, AnyTool>();

  register(tool: AnyTool): void {
    if (!NAME_RE.test(tool.name)) throw new Error(`invalid tool name: ${tool.name}`);
    if (this.tools.has(tool.name)) throw new Error(`tool already registered: ${tool.name}`);
    if (tool.limits.timeoutMs <= 0 || tool.limits.maxOutputBytes <= 0) throw new Error(`tool ${tool.name} needs positive limits`);
    this.tools.set(tool.name, tool);
  }

  get(name: string): AnyTool | undefined {
    return this.tools.get(name);
  }

  /** What the model is told it may PROPOSE. Listing a tool grants nothing; the policy engine decides. */
  specs(): ToolSpec[] {
    return [...this.tools.values()].map((t) => ({
      name: t.name,
      description: t.description,
      inputJsonSchema: z.toJSONSchema(t.inputSchema),
    }));
  }
}
