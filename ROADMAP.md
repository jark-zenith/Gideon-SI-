# GIDEON SI — Roadmap

Status: Phase 0 docs drafted; Phase 1 skeleton IMPLEMENTED and tested (see ARCHITECTURE §9). Phases 2+ are `PLANNED`. **MVP = Phases 0–5 plus the minimum of 6–7 listed below.** Everything else waits.

## MVP boundary
**In MVP:** auth, Core, text + push-to-talk voice, one provider, animated state interface, basic user-approved memory, GitHub read-only tool, policy + audit log.
**Must wait:** wake word, always-on mic, Android/desktop control, autonomous agents, multi-provider routing logic, realtime speech-to-speech, RAG over uploads, any write-capable tool.

---
## PHASE 0 — Architecture + Security
- **Objective:** Agreed foundation docs and decisions.
- **Dependencies:** Repo inspection (not completed: the repository was not readable by the author of this draft).
- **Deliverables:** README, AGENTS, docs/*, ADR-001…005.
- **Risks:** Over-design; unreviewed assumptions.
- **Done when:** Jark approves docs; open decisions in ARCHITECTURE §8 resolved.

## PHASE 1 — GIDEON Core  *(skeleton IMPLEMENTED; real provider adapter still pending)*
- **Objective:** Core skeleton: Context Manager, Model Router (single provider), Policy Engine, Tool Runtime, Audit Logger — no UI.
- **Dependencies:** Phase 0; language/runtime decision.
- **Deliverables:** Provider interface + one adapter; tool interface; policy engine with tiers; audit logger; unit tests incl. injection/permission-bypass cases.
- **Risks:** Leaky abstraction; policy bypass paths.
- **Done when:** Tests pass; a fake-free echo tool proves proposal→policy→execute→audit end to end; secrets absent from logs.

## PHASE 2 — Web Application
- **Objective:** Authenticated web shell talking to Gateway.
- **Dependencies:** Phase 1; Supabase project.
- **Deliverables:** Login, session handling, chat screen, responsive layout, RLS migrations, CI.
- **Risks:** Auth misconfig; client trusting itself.
- **Done when:** Two test users cannot see each other's data (automated test); no secret in bundle (scan).

## PHASE 3 — AI Conversation
- **Objective:** Real streamed conversations with context.
- **Dependencies:** Phases 1–2; provider key (server-side).
- **Deliverables:** Streaming chat, conversation storage, context window management, error/timeout handling.
- **Risks:** Cost runaway; hallucinated claims of action.
- **Done when:** Multi-turn conversation persists; rate/spend limits enforced; failure states tested.

## PHASE 4 — Voice (push-to-talk)
- **Objective:** Cascaded STT → Core → TTS.
- **Dependencies:** Phase 3; STT/TTS provider choice.
- **Deliverables:** Mic capture, transcription, spoken reply, barge-in (stop playback), voice state events.
- **Risks:** Latency; audio privacy; browser quirks.
- **Done when:** Spoken question → spoken answer works on target browsers; no audio persisted by default; measured latency documented.

## PHASE 5 — Holographic GIDEON Interface
- **Objective:** Original UI from the reference image driven by real states.
- **Dependencies:** Phase 4; asset layers (or masking decision).
- **Deliverables:** Idle/listening/thinking/speaking/alert/tool-running states; status panel bound to real status; mobile layout.
- **Risks:** Looking more capable than it is.
- **Done when:** Every status label reflects real state; unbuilt features labeled; reference asset untouched.

## PHASE 6 — Memory
- **Objective:** User-controlled memory.
- **Dependencies:** Phase 2 (RLS), Phase 3.
- **Deliverables (MVP minimum):** long-term memory with propose→approve flow, view/edit/delete/disable, export. (Project memory, vectors/RAG after MVP.)
- **Risks:** Poisoning; leakage.
- **Done when:** Isolation + deletion tests pass; deletion is real.

## PHASE 7 — GitHub Tools
- **Objective:** Read-only repository inspector.
- **Dependencies:** Phases 1, 3; GitHub App/token (read-only).
- **Deliverables:** list/read/branches/commits/structure tools, size caps, redaction, untrusted tagging, audit entries.
- **Risks:** Injection via repo content; over-broad token.
- **Done when:** Tool works on a real repo; malicious-README test does not change behavior; no write endpoint reachable.

## PHASE 8 — Agent Workflows
- **Objective:** Controlled multi-step workflows with approval gates.
- **Dependencies:** Phases 1, 6, 7 stable.
- **Deliverables:** Step/budget limits, plan display, per-step confirmation, kill switch.
- **Risks:** Runaway/escalation.
- **Done when:** Red-team review passed; all consequential steps gated.

## PHASE 9 — Android / Desktop
- **Objective:** Additional clients, permissioned device tools.
- **Dependencies:** Stable `/v1` API; Phase 8 optional.
- **Deliverables:** Android app, desktop/Chromebook client, approved device tools.
- **Risks:** OS restrictions; permission creep.
- **Done when:** Device actions pass through the same policy/audit path.

## PHASE 10 — Wake Word
- **Objective:** Local wake-word detection.
- **Dependencies:** Phase 9; privacy review.
- **Deliverables:** On-device detector, clear mic indicator, opt-in.
- **Risks:** Battery, false triggers, privacy.
- **Done when:** No audio leaves device before wake; opt-in/out works.

## PHASE 11 — Advanced GIDEON SI
- **Objective:** Realtime voice backend, multi-model routing, RAG, richer vision.
- **Dependencies:** All prior.
- **Deliverables:** Realtime `VoiceBackend`, router rules, knowledge engine.
- **Risks:** Cost, complexity.
- **Done when:** Each added by its own ADR and tested.
