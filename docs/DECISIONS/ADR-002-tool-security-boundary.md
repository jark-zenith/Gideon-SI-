# ADR-002 — Tool Security Boundary

## Context

LLMs can generate manipulated or unsafe outputs. External content can contain prompt injection. Giving a model direct execution authority would make the model an unsafe security boundary.

## Problem

Where must authorization and execution authority live?

## Alternatives considered

### A. Model executes tools directly
Fast to implement but unsafe because model output becomes authority.

### B. Client decides whether tools execute
Unsafe because clients are untrusted and can be modified.

### C. Server-side policy separates proposal from execution
Adds engineering work but establishes a trustworthy authorization boundary.

## Decision

The model only produces an action proposal. A server-side policy/permission layer validates and authorizes it. The tool runtime executes only approved calls. Actual execution is audit logged.

## Advantages

- clear security boundary;
- least-privilege enforcement;
- user confirmation can be enforced outside the model;
- easier auditing and testing.

## Disadvantages

- more components;
- policy must remain synchronized with tool definitions;
- sensitive workflows require explicit state handling.

## Consequences

No privileged tool may be callable from model output without policy evaluation.

## Future reconsideration criteria

Only reconsider if a demonstrably safer execution architecture replaces this boundary. Model capability alone is not sufficient justification.
