# ADR-004 — Supabase for Auth, PostgreSQL and Vectors
Status: ACCEPTED in principle — baseline decision approved by Jark Pruden (baseline decision #3 approved); details open to review

## Context
Need authentication, relational storage, vector search and per-user isolation at low cost during development, with a path to production.

## Problem
Which backing platform minimizes custom security code and cost while keeping data portable?

## Alternatives considered
1. Supabase (managed Postgres + Auth + pgvector + RLS + storage).
2. Self-managed PostgreSQL + a separate auth library.
3. Firebase / Firestore.
4. Cloudflare D1 + separate vector store.

## Decision
Supabase: Auth for identity, Postgres for all relational data, pgvector for embeddings, Row Level Security for isolation, storage for documents (later).

## Advantages
Standard Postgres (portable), RLS enforces isolation in the database, one service for auth + data + vectors, generous free tier for development.

## Disadvantages
Vendor dependency for auth and hosting; RLS mistakes are easy to make and dangerous; free-tier limits and pause behavior must be verified; service-role key is powerful and must stay server-side.

## Consequences
Every table has `user_id` + RLS from the first migration; migrations are versioned in the repo; CI includes cross-user isolation tests; the service-role key is never in any client. Data access sits behind repository functions to keep migration to plain Postgres feasible.

## Reconsideration criteria
Revisit if costs or limits block growth, if auth requirements exceed Supabase's capabilities, or if data-residency/compliance needs require self-hosting (Supabase can be self-hosted; plain Postgres remains the fallback).
