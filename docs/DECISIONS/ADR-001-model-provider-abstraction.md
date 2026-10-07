# ADR-001: Model Provider Abstraction

## Context
GIDEON is intended to work with multiple AI providers over time.

## Decision
Define a small provider interface and adapters rather than coupling GIDEON Core to one SDK.

## Alternatives
- One provider only: simpler, but creates lock-in.
- Full dynamic router immediately: unnecessary MVP complexity.

## Consequences
The core remains portable. Provider-specific features must be exposed deliberately through capabilities.

## Reconsider when
Multiple providers are actually needed by production workloads.
