import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryAuditLog, type AuditLogger, diagnosticsEcho } from '../core/index.js';
import { build, ctxFor, makeTool, proposal } from './helpers.js';

const open = { untrustedInContext: false };

test('real echo tool: proposal → policy → execute → audit trail', async () => {
  const audit = new InMemoryAuditLog();
  const { gateway } = build([diagnosticsEcho], audit);
  const out = await gateway.handle(ctxFor(), proposal('diagnostics.echo', { text: 'hello' }), open);
  assert.equal(out.status, 'ok');
  if (out.status === 'ok') {
    assert.deepEqual(out.data, { echoed: 'hello' });
    assert.equal(out.provenance.untrusted, true);
  }
  assert.deepEqual(audit.records().map((r) => r.type), ['proposal', 'decision', 'execution']);
  assert.equal(audit.verify().ok, true);
});

test('invalid input is denied and the tool never runs', async () => {
  const calls = { n: 0 };
  const { gateway } = build([makeTool({ name: 't.info', tier: 'INFORMATION', calls })]);
  const out = await gateway.handle(ctxFor(), proposal('t.info', { v: 123, extra: 1 }), open);
  assert.equal(out.status, 'denied');
  assert.equal(calls.n, 0);
});

test('unknown tool and missing scope are denied without running', async () => {
  const calls = { n: 0 };
  const { gateway } = build([makeTool({ name: 't.info', tier: 'INFORMATION', calls })]);
  assert.equal((await gateway.handle(ctxFor(), proposal('nope.tool', {}), open)).status, 'denied');
  assert.equal((await gateway.handle(ctxFor('u', []), proposal('t.info', { v: 'x' }), open)).status, 'denied');
  assert.equal(calls.n, 0);
});

test('SENSITIVE: needs confirmation, executes once with a valid bound confirmation, replay fails', async () => {
  const calls = { n: 0 };
  const { gateway } = build([makeTool({ name: 't.sens', tier: 'SENSITIVE', calls })]);
  const ctx = ctxFor();
  const first = await gateway.handle(ctx, proposal('t.sens', { v: 'a' }), open);
  assert.equal(first.status, 'confirmation_required');
  assert.equal(calls.n, 0);
  if (first.status !== 'confirmation_required') return;

  const ok = await gateway.handle(ctx, proposal('t.sens', { v: 'a' }), { ...open, confirmationId: first.confirmationId });
  assert.equal(ok.status, 'ok');
  assert.equal(calls.n, 1);

  const replay = await gateway.handle(ctx, proposal('t.sens', { v: 'a' }), { ...open, confirmationId: first.confirmationId });
  assert.equal(replay.status, 'confirmation_required');
  assert.equal(calls.n, 1);
});

test('confirmation is bound to exact arguments, user and session', async () => {
  const calls = { n: 0 };
  const { gateway } = build([makeTool({ name: 't.sens', tier: 'SENSITIVE', calls })]);
  const ctx = ctxFor();
  const mk = async () => {
    const r = await gateway.handle(ctx, proposal('t.sens', { v: 'a' }), open);
    if (r.status !== 'confirmation_required') throw new Error('expected confirmation');
    return r.confirmationId;
  };
  const diffArgs = await gateway.handle(ctx, proposal('t.sens', { v: 'DIFFERENT' }), { ...open, confirmationId: await mk() });
  assert.equal(diffArgs.status, 'confirmation_required');
  const otherUser = await gateway.handle(ctxFor('user-b'), proposal('t.sens', { v: 'a' }), { ...open, confirmationId: await mk() });
  assert.equal(otherUser.status, 'confirmation_required');
  const otherSession = await gateway.handle(ctxFor('user-a', undefined, 'sess-2'), proposal('t.sens', { v: 'a' }), { ...open, confirmationId: await mk() });
  assert.equal(otherSession.status, 'confirmation_required');
  assert.equal(calls.n, 0);
});

test('HIGH_RISK never executes, even with a confirmation id', async () => {
  const calls = { n: 0 };
  const { gateway } = build([makeTool({ name: 't.high', tier: 'HIGH_RISK', calls })]);
  const out = await gateway.handle(ctxFor(), proposal('t.high', { v: 'x' }), { ...open, confirmationId: 'whatever' });
  assert.equal(out.status, 'denied');
  assert.equal(calls.n, 0);
});

test('audit failure fails closed: tool does not execute', async () => {
  const calls = { n: 0 };
  const broken: AuditLogger = { append: async () => { throw new Error('db down'); } };
  const { gateway } = build([makeTool({ name: 't.info', tier: 'INFORMATION', calls })], broken);
  const out = await gateway.handle(ctxFor(), proposal('t.info', { v: 'x' }), open);
  assert.equal(out.status, 'error');
  if (out.status === 'error') assert.equal(out.code, 'audit_unavailable');
  assert.equal(calls.n, 0);
});

test('audit failure AFTER execution is reported honestly, not as success', async () => {
  let n = 0;
  const flaky = new InMemoryAuditLog();
  const wrapper: AuditLogger = { append: async (e) => { if (++n === 3) throw new Error('late failure'); return flaky.append(e); } };
  const { gateway } = build([makeTool({ name: 't.info', tier: 'INFORMATION' })], wrapper);
  const out = await gateway.handle(ctxFor(), proposal('t.info', { v: 'x' }), open);
  assert.equal(out.status, 'error');
  if (out.status === 'error') assert.equal(out.code, 'audit_failed_after_execution');
});

test('timeout, oversized output and secret redaction are enforced by the runtime', async () => {
  const { gateway } = build([
    makeTool({ name: 't.slow', tier: 'INFORMATION', timeoutMs: 30, run: () => new Promise(() => {}) }),
    makeTool({ name: 't.big', tier: 'INFORMATION', maxBytes: 100, run: async () => ({ blob: 'x'.repeat(500) }) }),
    makeTool({ name: 't.leak', tier: 'INFORMATION', run: async () => ({ note: 'key sk-abcdefghijklmnop1234567890 and ghp_abcdefghijklmnopqrstuvwxyz0123' }) }),
  ]);
  const slow = await gateway.handle(ctxFor(), proposal('t.slow', { v: 'x' }), open);
  assert.equal(slow.status === 'error' && slow.code, 'timeout');
  const big = await gateway.handle(ctxFor(), proposal('t.big', { v: 'x' }), open);
  assert.equal(big.status === 'error' && big.code, 'output_too_large');
  const leak = await gateway.handle(ctxFor(), proposal('t.leak', { v: 'x' }), open);
  assert.equal(leak.status, 'ok');
  const text = JSON.stringify(leak.status === 'ok' ? leak.data : '');
  assert.ok(!text.includes('sk-abcdefghijklmnop'));
  assert.ok(!text.includes('ghp_abcdefghijklmnop'));
});

test('audit log never stores secrets from arguments', async () => {
  const audit = new InMemoryAuditLog();
  const { gateway } = build([makeTool({ name: 't.info', tier: 'INFORMATION' })], audit);
  await gateway.handle(ctxFor(), proposal('t.info', { v: 'token=abcd1234efgh5678 and sk-abcdefghijklmnop1234567890' }), open);
  const dump = JSON.stringify(audit.records());
  assert.ok(!dump.includes('abcd1234efgh5678'));
  assert.ok(!dump.includes('sk-abcdefghijklmnop'));
});
