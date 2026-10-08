# GIDEON SI — Architecture

Status: **DRAFT — awaiting Jark Pruden's approval.** Everything below is `PLANNED` / `NOT YET IMPLEMENTED` unless stated.

## 1. Overview
```
Client (web | Android | desktop | Chromebook/Linux)
   ↓  HTTPS / WebSocket / WebRTC — session token only, never provider secrets
GIDEON Gateway
   ↓
Authentication / Session
   ↓
GIDEON Core
   ├── Context Manager
   ├── Memory Service
   ├── Model Router
   ├── Tool Runtime
   ├── Permission Policy
   ├── Safety Layer
   └── Audit Logger
```

## 2. Component responsibilities
| Component | Responsibility | Must NOT |
|---|---|---|
| **Client** | Capture input (text, push-to-talk audio), render UI/hologram states, play audio, show confirmation prompts | Hold provider keys; decide permissions; call providers or tools directly |
| **Gateway** | TLS termination, request validation, rate limiting, size limits, routing, CORS, streaming transport | Contain business logic |
| **Authentication / Session** | Verify identity (Supabase Auth), issue short-lived session tokens, bind sessions to user + device, revoke | Trust client-supplied user IDs |
| **Context Manager** | Assemble each model request: system policy, conversation window, approved memory, tool results (marked untrusted); enforce token budgets | Mix untrusted content into the instruction channel |
| **Memory Service** | Read/write/search/delete/export memory per user (see MEMORY-ARCHITECTURE) | Save memory from external content without user approval |
| **Model Router** | Choose a provider/model per request via the provider interface; normalize responses; handle failure/fallback | Execute tools; leak provider specifics into Core |
| **Tool Runtime** | Validate input, run a tool in its sandbox, return typed results tagged with provenance | Run anything not approved by the Permission Policy |
| **Permission Policy** | Decide allow / deny / require-confirmation for each proposed action from user, session, tool, risk tier, arguments | Be overridable by model output or retrieved content |
| **Safety Layer** | Injection heuristics, output redaction (secrets/PII), refusal rules, "no fake success" checks (response claims must match audit records) | Be the only defense (defense in depth) |
| **Audit Logger** | Append-only record of every proposal, decision, confirmation and execution | Store raw secrets, raw audio or full file contents |

## 3. Execution model
```
AI MODEL → ACTION PROPOSAL → POLICY ENGINE → PERMISSION CHECK
        → USER CONFIRMATION IF REQUIRED → TOOL → AUDIT LOG
```
The model emits a *proposal* (tool name + arguments). Core never treats it as an instruction to run. Tool results re-enter the model as **untrusted data**.

## 4. Provider abstraction (summary — ADR-001)
Core talks to one `ModelProvider` interface (generate, stream, declared capabilities). Adapters (OpenAI, Gemini, Claude, local) live behind it. MVP ships **one** adapter plus the interface; routing logic stays trivial (single provider) until a second adapter exists. Provider-specific capabilities (vision, native tool calling, realtime audio) are exposed as declared capabilities; Core degrades gracefully when absent.

## 5. Multi-client design
All clients speak the same Gateway API (versioned, `/v1`). Clients are thin: input/output + UI. Per client:
- **Web (first):** browser audio APIs for push-to-talk; auth via Supabase session.
- **Android (PLANNED, Phase 9):** same API; OS permissions grant device capability, but every device action still goes through Core's policy layer.
- **Desktop / Chromebook/Linux (PLANNED, Phase 9):** same API; local helper for approved system actions, sandboxed, user-granted.
Clients never receive provider keys; they receive only a short-lived token scoped to one user/session. Device capabilities are exposed to Core as **tools** with their own risk tiers.

## 6. Data stores
Supabase Postgres: users/profiles, conversations, memory items + pgvector embeddings, tool grants, audit log. RLS on every user table (ADR-004). Object storage for uploaded documents (PLANNED).

## 7. Deployment (PROPOSED)
Web frontend on Vercel/Cloudflare Pages; Core + Gateway as a Node service (Render proposed, since long-lived streaming connections suit a normal server better than short-lived functions); Supabase hosted. Free tiers during development. Requires approval.

## 8. Decisions
**Approved by Jark Pruden:** official name GIDEON SI · TypeScript on Node 22+ · Render for the backend · monorepo.
**Still open:** first LLM provider · STT provider · TTS provider · voice identity · web frontend host · auth methods and open-vs-invite sign-up.

## 9. Implementation status (Phase 1)
| Component | Status |
|---|---|
| Context Manager (`core/orchestrator/context.ts`) | IMPLEMENTED (character-based budget; real tokenization PLANNED) |
| Model Router + provider interface (`core/models`) | IMPLEMENTED; no real provider adapter yet |
| Permission Policy (`core/security/policy.ts`) | IMPLEMENTED |
| Tool Runtime / Gateway (`core/orchestrator/gateway.ts`, `core/tools`) | IMPLEMENTED (validation, timeout, output limit, redaction, provenance) |
| Confirmations (`core/security/confirmations.ts`) | IMPLEMENTED in memory |
| Audit Logger (`core/security/audit.ts`) | IMPLEMENTED in memory, hash-chained; durable insert-only storage NOT YET IMPLEMENTED |
| Safety Layer | Redaction IMPLEMENTED; injection heuristics and claim-vs-audit checks NOT YET IMPLEMENTED |
| Memory Service, Gateway (HTTP), Authentication/Session | NOT YET IMPLEMENTED |
