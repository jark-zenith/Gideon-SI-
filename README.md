# GIDEON SI — GIDEON Super Intelligence

*Official name: **GIDEON SI** (approved by Jark Pruden).*

**Owner:** PRUDEN AI TECH INDUSTRIES · **Project Lead:** Jark Pruden
**Repository:** `jark-zenith/Gideon-SI-`

> BUILD THE FUTURE, BUT BUILD IT FOR REAL.

GIDEON SI is an original male personal-AI assistant inspired by the *concept* of Gideon from *The Flash*.
It has its own identity, architecture, voice, interface and personality. It is **not** an official DC / Warner Bros. product.

## Status

| Area | Status |
|---|---|
| Architecture, security model, ADRs, roadmap | **Drafted — awaiting Jark Pruden's review** |
| GIDEON Core skeleton (context, router, policy, tool gateway, audit, confirmations) | **IMPLEMENTED (Phase 1) — 29 automated tests passing; in-memory only, text turns only** |
| Web app | NOT YET IMPLEMENTED |
| AI provider layer | Interface + router IMPLEMENTED; **no real provider adapter yet** (NOT YET IMPLEMENTED) |
| Voice (push-to-talk) | NOT YET IMPLEMENTED |
| Holographic interface | NOT YET IMPLEMENTED (reference image only) |
| Memory | NOT YET IMPLEMENTED |
| Tools | One real diagnostic tool (`diagnostics.echo`) IMPLEMENTED; GitHub read-only tool NOT YET IMPLEMENTED |
| Durable audit log / database / auth | NOT YET IMPLEMENTED (Phase 2, Supabase) |
| Safety Layer claim-vs-audit verification | NOT YET IMPLEMENTED |
| Wake word / Android / agents | PLANNED, deliberately later |

Nothing in this repository should be described as working until it has been implemented **and tested**.

## What GIDEON SI is meant to become

A conversational intelligence + memory + tools + voice + vision + secure device interaction, reachable from web, Android, desktop and Chromebook/Linux through one backend.

## Where to read next

- `AGENTS.md` — rules for every AI coding agent working here (**read first**)
- `docs/ARCHITECTURE.md` — system design and component responsibilities
- `docs/SECURITY-ARCHITECTURE.md` — threat model and trust boundaries
- `docs/ROADMAP.md` — phases 0–11, MVP scope
- `docs/VOICE-ARCHITECTURE.md`, `docs/MEMORY-ARCHITECTURE.md`, `docs/TOOL-ARCHITECTURE.md`
- `docs/AI-TEAM.md` — who does what
- `docs/DECISIONS/` — architecture decision records (ADR-001 … ADR-005)

## Principles

1. No fake functionality. Unbuilt things are labeled `PLANNED` or `NOT YET IMPLEMENTED`.
2. The AI model proposes; the policy engine decides; the tool runtime executes; the audit log records.
3. Secrets never leave the server.
4. External content is data, never instructions.
5. Jark Pruden makes the final decision on architecture.

## Run the tests (Phase 1)
```
npm install
npm test        # compiles TypeScript, runs 29 tests with Node's built-in test runner
```
Requires Node 22+. There is no runnable server or UI yet.
