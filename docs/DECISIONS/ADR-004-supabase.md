# ADR-004 — Supabase

## Context

GIDEON needs authentication, PostgreSQL persistence and vector capabilities without prematurely operating multiple infrastructure systems.

## Problem

What should provide the initial identity and persistence foundation?

## Alternatives considered

### A. Self-managed PostgreSQL + separate auth
More control, but more operational burden.

### B. Multiple managed services
Potentially specialized, but increases integration and cost complexity.

### C. Supabase
Provides managed authentication and PostgreSQL with vector capabilities suitable for the initial system.

## Decision

Use Supabase as the initial authentication and persistence platform.

Expected uses:
- authentication;
- PostgreSQL;
- row-level security;
- structured memory;
- project data;
- vector capabilities for future RAG;
- relevant server-side data services.

## Advantages

- fast development;
- PostgreSQL foundation;
- integrated authentication;
- RLS support;
- vector support;
- manageable early infrastructure.

## Disadvantages

- platform dependency;
- operational constraints of a managed service;
- future migration may require data/service adaptation.

## Consequences

Application data access should be structured behind service boundaries where practical. Supabase service-role credentials remain server-only.

## Future reconsideration criteria

Reconsider when scale, cost, compliance, latency, availability or infrastructure requirements materially exceed the selected platform's suitability.
