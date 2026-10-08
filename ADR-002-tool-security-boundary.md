# ADR-002 — Tool Security Boundary
Status: ACCEPTED in principle — baseline decision approved by Jark Pruden (baseline decisions #8–#11 approved); details open to review

## Context
LLM output can be manipulated by user input and by external content. Tools can read or change real systems.

## Problem
Where is the enforceable boundary between "model says" and "system does"?

## Alternatives considered
1. Let the model call tools directly, relying on prompt instructions.
2. Model proposes; a safety prompt/classifier approves.
3. Model proposes; deterministic policy engine + permissions + confirmation + audit decide (code, not model).

## Decision
Option 3: `AI MODEL → ACTION PROPOSAL → POLICY ENGINE → PERMISSION CHECK → USER CONFIRMATION IF REQUIRED → TOOL → AUDIT LOG`. Tools are invoked only by Tool Runtime. Risk tiers INFORMATION / REVERSIBLE / SENSITIVE / HIGH_RISK. External content is untrusted data. Audit logging is mandatory; for SENSITIVE tools, failure to write the audit record blocks execution.

## Advantages
Security does not depend on the model behaving; auditable; consistent across voice, text and future clients; supports the "no fake success" rule.

## Disadvantages
More code and friction (confirmations); some legitimate flows need an extra click; policy bugs become the critical risk.

## Consequences
Policy engine gets the heaviest test coverage (bypass, injection, cross-user). Every new tool declares tier and scopes. Realtime voice backends (future) may not hold tool credentials.

## Reconsideration criteria
Revisit if confirmations measurably block core workflows (consider scoped standing approvals with expiry), or if an auditable, deterministic policy language is adopted.
