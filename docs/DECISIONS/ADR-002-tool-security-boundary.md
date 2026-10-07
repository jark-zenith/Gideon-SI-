# ADR-002: Tool Security Boundary

## Decision
The model never executes tools directly. Tool execution always passes through policy, permission and audit layers.

## Reason
Model output is untrusted and may be manipulated by prompt injection or malicious external data.

## Consequences
More components and validation, but a much safer architecture.
