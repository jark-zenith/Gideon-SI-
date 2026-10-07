# ADR-001 — Model Provider Abstraction

## Context

GIDEON may eventually use multiple model providers. Directly coupling GIDEON Core to one provider SDK would make provider changes expensive and could spread provider-specific assumptions through the system.

## Problem

How can GIDEON support one provider initially without creating provider lock-in?

## Alternatives considered

### A. Hard-code one provider
Simplest initial implementation, but provider APIs become embedded in Core and future migration is expensive.

### B. Build a dynamic multi-provider router immediately
Flexible, but introduces unnecessary routing, capability, cost and fallback complexity before there is a production need.

### C. Small provider interface with adapters
Keeps Core stable while allowing one provider to be implemented first.

## Decision

Use a small internal `GideonModelProvider` abstraction. Provider SDKs live behind adapters. The MVP may register one provider.

Provider-specific capabilities must be represented deliberately rather than leaking SDK types into Core.

## Advantages

- reduces provider lock-in;
- keeps Core testable;
- enables provider substitution;
- makes mock/test providers possible.

## Disadvantages

- abstraction must be maintained;
- not every provider feature maps identically;
- streaming, multimodal and tool semantics may require capability metadata.

## Consequences

Core contracts should use GIDEON-owned types. Provider adapters normalize provider-specific responses.

## Future reconsideration criteria

Reconsider when:
- two or more providers are used in production;
- provider-specific capabilities become central;
- routing requirements justify a dedicated capability registry;
- abstraction causes measurable loss of required functionality.
