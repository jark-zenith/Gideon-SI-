import { createHash } from 'node:crypto';

/** Deterministic JSON: object keys sorted recursively, undefined dropped. */
export function canonicalize(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return '[' + v.map(canonicalize).join(',') + ']';
  const o = v as Record<string, unknown>;
  const keys = Object.keys(o).filter((k) => o[k] !== undefined).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalize(o[k])).join(',') + '}';
}

export function sha256Hex(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}
