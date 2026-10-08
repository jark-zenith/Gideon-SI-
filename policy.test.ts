import test from 'node:test';
import assert from 'node:assert/strict';
import { decide } from '../core/index.js';
import { makeTool } from './helpers.js';

const scopes = new Set(['test:use']);
const base = { grantedScopes: scopes, untrustedInContext: false, confirmationValid: false };

test('unknown tool is denied', () => {
  assert.equal(decide({ ...base, tool: undefined }).outcome, 'DENY');
});
test('missing scope is denied even for INFORMATION tools', () => {
  const t = makeTool({ name: 'a.info', tier: 'INFORMATION', scopes: ['other:scope'] });
  const d = decide({ ...base, tool: t });
  assert.equal(d.outcome, 'DENY');
  assert.match(d.reason, /missing_scope/);
});
test('INFORMATION allowed when granted', () => {
  assert.equal(decide({ ...base, tool: makeTool({ name: 'a.info', tier: 'INFORMATION' }) }).outcome, 'ALLOW');
});
test('SENSITIVE requires confirmation, allowed once confirmed', () => {
  const t = makeTool({ name: 'a.sens', tier: 'SENSITIVE' });
  assert.equal(decide({ ...base, tool: t }).outcome, 'REQUIRE_CONFIRMATION');
  assert.equal(decide({ ...base, tool: t, confirmationValid: true }).outcome, 'ALLOW');
});
test('HIGH_RISK is never allowed, even with confirmation', () => {
  const t = makeTool({ name: 'a.high', tier: 'HIGH_RISK' });
  assert.equal(decide({ ...base, tool: t, confirmationValid: true }).outcome, 'DENY');
});
test('REVERSIBLE escalates to confirmation after untrusted content', () => {
  const t = makeTool({ name: 'a.rev', tier: 'REVERSIBLE' });
  assert.equal(decide({ ...base, tool: t }).outcome, 'ALLOW');
  assert.equal(decide({ ...base, tool: t, untrustedInContext: true }).outcome, 'REQUIRE_CONFIRMATION');
  assert.equal(decide({ ...base, tool: t, untrustedInContext: true, confirmationValid: true }).outcome, 'ALLOW');
});
