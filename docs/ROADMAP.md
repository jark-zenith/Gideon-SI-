# GIDEON SI — Engineering Roadmap

## MVP boundary

The MVP is the smallest real system that can:
- authenticate a user;
- accept text;
- call a real model through the provider abstraction;
- maintain bounded conversation context;
- apply the tool policy boundary;
- record real audit events;
- provide one real, read-only GitHub inspection tool;
- support push-to-talk voice through the cascaded pipeline.

Holographic polish, wake word, autonomous agents and device control are not MVP requirements.

---

## Phase 0 — Architecture + Security

**Objective:** establish the engineering foundation.

**Dependencies:** repository access.

**Deliverables:** architecture docs, security model, ADRs, agent instructions, repository conventions, baseline tests.

**Risks:** premature implementation or undocumented architecture drift.

**Definition of done:** reviewed blueprint committed; existing reference asset preserved; baseline tests/checks pass.

**Status:** FOUNDATION BRANCH ESTABLISHED.

## Phase 1 — GIDEON Core

**Objective:** implement production-ready core contracts and orchestration.

**Dependencies:** Phase 0.

**Deliverables:** core interfaces, context manager, provider adapter contract, normalized responses, policy service, audit service, error model.

**Risks:** over-coupling provider SDKs; bypassing policy.

**Definition of done:** real provider can answer through Core; no privileged tool bypass; automated tests cover core paths.

## Phase 2 — Web Application

**Objective:** provide an authenticated web client.

**Dependencies:** Phase 1, Supabase Auth.

**Deliverables:** web shell, login/session handling, conversation UI, server API.

**Risks:** leaking secrets or trusting client identity.

**Definition of done:** authenticated user can communicate with Core through the real backend.

## Phase 3 — AI Conversation

**Objective:** reliable text conversation.

**Dependencies:** Phase 1–2.

**Deliverables:** provider adapter, context handling, streaming where justified, error states, observability.

**Risks:** provider failures, hallucination, cost.

**Definition of done:** real responses; honest failure states; provider secrets server-side.

## Phase 4 — Voice

**Objective:** real push-to-talk voice.

**Dependencies:** Phase 3.

**Deliverables:** microphone permission flow, STT adapter, TTS adapter, voice state machine, cancellation/error handling.

**Risks:** privacy, latency, provider cost, microphone lifecycle bugs.

**Definition of done:** one real voice turn completes reliably; microphone is not left active.

## Phase 5 — Holographic GIDEON Interface

**Objective:** original visual assistant presentation.

**Dependencies:** real Core/voice states.

**Deliverables:** visual states for idle/listening/processing/speaking/error; original PRUDEN visual language; reference image integration as approved.

**Risks:** building visual simulation ahead of real functionality.

**Definition of done:** UI state is driven by actual system state.

## Phase 6 — Memory

**Objective:** user-controlled persistent memory.

**Dependencies:** authenticated backend and Supabase.

**Deliverables:** schemas, RLS, memory service, retrieval, deletion, management UI, project memory.

**Risks:** cross-user leakage, poisoning, over-retention.

**Definition of done:** memory is isolated, inspectable and deletable.

## Phase 7 — GitHub Tools

**Objective:** first real external tool.

**Dependencies:** Core policy, audit, authenticated backend.

**Deliverables:** read-only repository inspector, GitHub auth integration, structured results, security tests.

**Risks:** malicious repository content, excessive scopes, rate limits.

**Definition of done:** authorized user can inspect a real repository and receive auditable factual results.

## Phase 8 — Agent Workflows

**Objective:** bounded multi-step assistance.

**Dependencies:** strong tool policy, audit, verification and evaluation.

**Deliverables:** workflow engine, approval gates, state machine, retries/timeouts, verification.

**Risks:** prompt injection, loops, cost, unintended actions.

**Definition of done:** only approved bounded workflows operate; privileged steps require policy/confirmation.

## Phase 9 — Android / Desktop

**Objective:** shared backend clients and permissioned device integrations.

**Dependencies:** mature auth/tool security.

**Deliverables:** platform clients and narrowly scoped capabilities.

**Risks:** platform permissions, device compromise, privacy.

**Definition of done:** every capability is explicitly permissioned and auditable.

## Phase 10 — Wake Word

**Objective:** evaluate privacy-preserving wake-word operation.

**Dependencies:** voice architecture and platform research.

**Deliverables:** local wake-word evaluation; privacy/battery analysis; opt-in design.

**Risks:** always-on privacy, false activation, battery use.

**Definition of done:** approved privacy model and reliable local activation before production use.

## Phase 11 — Advanced GIDEON SI

**Objective:** mature multimodal, realtime and agent capabilities.

**Dependencies:** previous phases.

**Deliverables:** realtime voice backend, richer model routing, multimodal workflows, advanced tool ecosystem.

**Risks:** complexity, cost, security and reliability.

**Definition of done:** capability-specific evaluations demonstrate reliable behavior.

---

Every phase follows the same rule: **no fake functionality and no undocumented architectural drift.**
