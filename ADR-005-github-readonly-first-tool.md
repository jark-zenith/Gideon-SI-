# ADR-005 — GitHub Read-Only Repository Inspector as the First Real Tool
Status: ACCEPTED in principle — baseline decision approved by Jark Pruden (baseline decision #6 approved); details open to review

## Context
GIDEON needs one real, valuable tool to prove the proposal → policy → execution → audit loop honestly. The project itself lives on GitHub, so inspection is immediately useful.

## Problem
Which first tool proves the architecture with minimal risk?

## Alternatives considered
1. Web search tool.
2. Calendar/email tool.
3. Local file/system tool.
4. GitHub read-only inspector.
5. GitHub with write access (PRs, commits).

## Decision
Option 4. Read-only, scoped to user-selected repositories, using a read-only GitHub App or fine-grained token held server-side. No write capability exists in the code path.

## Advantages
Immediately useful; low blast radius; exercises untrusted-content handling (repo text) and audit; deterministic outputs are testable.

## Disadvantages
Repo content is a rich prompt-injection surface; rate limits; large repos need caps; private-repo access requires careful credential handling.

## Consequences
Content is always tagged untrusted; size/type limits; secret redaction; a test proves no write endpoint is reachable; the assistant may claim analysis only when an audit record exists. Write capabilities require a new ADR and Jark's approval.

## Reconsideration criteria
Revisit write access only after policy engine, confirmation flow and audit are proven in production use, and Jark explicitly approves. Revisit tool choice if the inspector proves low-value in daily use.
