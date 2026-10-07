# GIDEON SI — Architecture

## 1. Purpose

GIDEON SI is a provider-agnostic, permissioned personal AI system. The architecture separates perception, reasoning, authority and execution so that a model can assist without becoming a trusted execution environment.

## 2. Fundamental architecture

```
Client
  ↓
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

### Client

The client is responsible for presentation and user interaction.

Initial target:
- Web client.

Future clients:
- Android;
- desktop;
- Chromebook/Linux.

The client must not contain provider secrets or privileged execution authority.

### GIDEON Gateway

The gateway is the server entry point.

Responsibilities:
- request validation;
- authentication/session verification;
- rate limiting;
- API routing;
- request correlation;
- abuse controls;
- client capability negotiation.

It must reject unauthenticated or malformed requests before they reach privileged services.

### Authentication / Session

Authentication establishes the user identity and session context used by every downstream service.

The MVP baseline uses Supabase Auth.

Every request reaching protected GIDEON Core functionality must have an authenticated identity and server-derived user/session identifiers.

### GIDEON Core

GIDEON Core is the orchestration boundary.

Responsibilities:
- receive normalized user input;
- build context;
- request model reasoning;
- accept model action proposals;
- pass proposals to policy;
- coordinate approved tool calls;
- collect tool results;
- produce the final response.

GIDEON Core must not assume model output is trustworthy.

### Context Manager

Combines:
- current conversation;
- session state;
- relevant user/project memory;
- authorized tool results;
- system-level application context.

External content must be marked as data and must not be promoted into trusted instructions.

### Memory Service

Owns structured memory and vector retrieval.

It is responsible for:
- storage;
- retrieval;
- user/project scoping;
- deletion;
- future export;
- memory disablement;
- retrieval filtering.

### Model Router

The router selects an available provider through a stable internal interface.

Initial MVP:
- one provider implementation is sufficient.

Future providers may include OpenAI, Gemini, Claude and local models.

Provider-specific APIs stay inside adapters.

### Tool Runtime

The runtime is the only component permitted to execute registered tools.

It must receive:
- a registered tool definition;
- validated input;
- an authenticated context;
- an approved policy decision.

Tools return structured success/failure results.

### Permission Policy

Policy is the authority boundary between model proposals and execution.

It evaluates:
- tool identity;
- action tier;
- user permission;
- confirmation state;
- input constraints;
- future resource scopes.

### Safety Layer

The safety layer validates:
- input;
- model/tool output boundaries;
- external-data handling;
- dangerous requests;
- authorization assumptions;
- tool arguments.

It should fail closed for ambiguous privileged actions.

### Audit Logger

Audit records should capture:
- authentication/security events;
- tool proposals;
- policy decisions;
- confirmations;
- actual executions;
- failures;
- relevant resource identifiers.

Never log API keys, bearer tokens or unnecessary sensitive payloads.

## 3. Client portability

All clients connect to the same backend contracts.

```
Web ───────┐
Android ───┤
Desktop ───┼──→ GIDEON Gateway → Core
Chromebook ┘
```

Platform-specific clients may provide different input/output capabilities, but authorization remains server-side and consistent.

A client must never be able to bypass the Gateway and invoke a privileged tool directly.

## 4. Voice boundary

Voice is an input/output adapter around GIDEON Core, not a separate intelligence.

MVP:

```
Microphone → STT → Core → LLM → TTS → Audio
```

Future realtime speech-to-speech implementations must satisfy the same normalized core contracts.

## 5. Data boundary

Supabase/PostgreSQL is the initial persistence layer.

Expected separation:
- identity/authentication;
- user data;
- sessions/conversations;
- memories;
- project knowledge;
- audit records.

Row-level security and server-side authorization must enforce tenant isolation.

## 6. Visual identity

The existing repository holographic/reference image is preserved. It is a visual reference for the original GIDEON character/interface and is not evidence that a holographic runtime exists.

The final UI must use original PRUDEN AI visual language rather than copying proprietary television UI assets.

## 7. Current implementation boundary

The repository currently contains a small TypeScript core foundation and policy tests on the Phase 0 branch. Production Gateway, authentication, model adapters, persistent memory, voice, tools and application UI remain **NOT YET IMPLEMENTED**.
