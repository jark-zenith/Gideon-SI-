import { randomUUID } from 'node:crypto';
import { canonicalize, sha256Hex } from './canonical.js';

export type AuditEventType = 'proposal' | 'decision' | 'confirmation_requested' | 'execution';

export interface AuditEntry {
  userId: string;
  sessionId: string;
  type: AuditEventType;
  tool: string;
  argsHash: string;
  argsRedacted: string;
  decision?: 'ALLOW' | 'DENY' | 'REQUIRE_CONFIRMATION';
  reason?: string;
  confirmationId?: string;
  status?: 'ok' | 'error';
  errorCode?: string;
  durationMs?: number;
  resultSummary?: string;
}

export interface AuditRecord extends AuditEntry {
  id: string;
  ts: string;
  prevHash: string;
  hash: string;
}

/** Implementations MUST be append-only. A failed append must throw (callers fail closed). */
export interface AuditLogger {
  append(entry: AuditEntry): Promise<AuditRecord>;
}

const GENESIS = '0'.repeat(64);

/**
 * In-memory, hash-chained audit log. IMPLEMENTED for Phase 1 and tests only.
 * Durable, insert-only database storage is PLANNED for Phase 2 (Supabase).
 */
export class InMemoryAuditLog implements AuditLogger {
  private readonly items: AuditRecord[] = [];

  async append(entry: AuditEntry): Promise<AuditRecord> {
    const prevHash = this.items.at(-1)?.hash ?? GENESIS;
    const base = { ...entry, id: randomUUID(), ts: new Date().toISOString(), prevHash };
    const hash = sha256Hex(prevHash + canonicalize(base));
    const rec: AuditRecord = { ...base, hash };
    this.items.push(rec);
    return rec;
  }

  records(): readonly AuditRecord[] {
    return this.items;
  }

  /** Recomputes the chain. Detects edits, deletions and reordering of stored records. */
  verify(records: readonly AuditRecord[] = this.items): { ok: boolean; brokenAt?: number } {
    let prev = GENESIS;
    for (let i = 0; i < records.length; i++) {
      const { hash, ...base } = records[i]!;
      if (base.prevHash !== prev || sha256Hex(prev + canonicalize(base)) !== hash) return { ok: false, brokenAt: i };
      prev = hash;
    }
    return { ok: true };
  }
}
