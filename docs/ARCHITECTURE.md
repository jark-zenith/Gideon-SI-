# GIDEON SI Architecture

## System goal
GIDEON SI is a provider-agnostic, permissioned AI assistant. The client presents the experience; the server owns identity, model access, tools, policy and audit.

## High-level flow
Client
→ GIDEON Gateway
→ Authentication / Session
→ GIDEON Core
→ Context Manager / Memory / Model Router / Tool Runtime / Safety / Audit

## Components
### Client
Web first, with future Android and desktop clients. It must never hold provider secrets.

### Gateway
Authentication, short-lived sessions, rate limits, request validation and API routing.

### GIDEON Core
Orchestrates context, model requests, tool proposals and final responses. It does not directly execute privileged actions.

### Context Manager
Combines current conversation, session state, relevant memory and approved tool results.

### Model Router
A small provider interface that can support OpenAI, Gemini, Claude and future/local models without coupling the core to one SDK.

### Memory Service
Owns user-approved memory, project memory and future vector retrieval.

### Tool Runtime
Executes only tools approved by the policy layer. Tools receive validated inputs and return structured results.

### Permission Policy
The security boundary between model output and execution.

### Safety Layer
Validates requests, tool arguments and action tier before execution.

### Audit Logger
Records authentication events, tool proposals, approvals, executions, failures and relevant metadata without storing secrets.

## Action tiers
- INFORMATION: answer/retrieve.
- REVERSIBLE: may execute under normal permission.
- SENSITIVE: explicit user confirmation.
- HIGH-RISK: disabled by default and requires stronger controls.

## Voice
MVP: microphone → STT → GIDEON Core → LLM → TTS → output.
Realtime speech-to-speech is a future replaceable backend.

## Future clients
Web, Android, desktop and Chromebook/Linux clients should authenticate to the same backend and receive capabilities according to the same server-side policy.

## Visual identity
The existing repository hologram asset is the reference for the original male GIDEON visual identity. The interface should use original PRUDEN AI visual language and must not copy proprietary television UI assets.
