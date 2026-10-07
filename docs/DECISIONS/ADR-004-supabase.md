# ADR-004: Supabase

## Decision
Use Supabase for the initial authentication, PostgreSQL and vector-search foundation.

## Reason
It consolidates core infrastructure and supports user isolation and rapid MVP development.

## Consequences
GIDEON should keep a data-access abstraction where practical so infrastructure can evolve later.
