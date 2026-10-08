import { randomUUID } from 'node:crypto';
import { canonicalize, sha256Hex } from './canonical.js';
import type { SessionContext } from '../tools/types.js';

interface Pending {
  userId: string;
  sessionId: string;
  tool: string;
  argsHash: string;
  expiresAt: number;
}

/**
 * Confirmations are bound to user + session + tool + exact arguments, expire, and are single-use.
 * In-memory for Phase 1; durable storage is PLANNED. A confirmation must originate from an explicit
 * user action in the client — never from model text.
 */
export class ConfirmationStore {
  private readonly pending = new Map<string, Pending>();
  constructor(private readonly now: () => number = Date.now) {}

  static hashArgs(args: unknown): string {
    return sha256Hex(canonicalize(args));
  }

  request(ctx: SessionContext, tool: string, args: unknown, ttlMs = 120_000): { id: string; expiresAt: number } {
    const id = randomUUID();
    const expiresAt = this.now() + ttlMs;
    this.pending.set(id, { userId: ctx.userId, sessionId: ctx.sessionId, tool, argsHash: ConfirmationStore.hashArgs(args), expiresAt });
    return { id, expiresAt };
  }

  /** Returns true at most once per confirmation, and only for the exact bound call. */
  consume(id: string, ctx: SessionContext, tool: string, args: unknown): boolean {
    const p = this.pending.get(id);
    if (!p) return false;
    this.pending.delete(id); // single use, even on mismatch: a probing attempt burns it
    return (
      p.expiresAt > this.now() &&
      p.userId === ctx.userId &&
      p.sessionId === ctx.sessionId &&
      p.tool === tool &&
      p.argsHash === ConfirmationStore.hashArgs(args)
    );
  }
}
