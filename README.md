# GIDEON SI

**GIDEON Super Intelligence**  
**PRUDEN AI TECH INDUSTRIES**

GIDEON SI is an original personal AI system led by **Jark Pruden**. It is inspired by the futuristic AI-assistant concept represented by Gideon in *The Flash*, but it is not a DC/Warner Bros. product and does not reproduce the fictional system.

> **BUILD THE FUTURE, BUT BUILD IT FOR REAL.**

## Project ownership

- **Organization:** PRUDEN AI TECH INDUSTRIES
- **Project:** GIDEON SI
- **Full meaning:** GIDEON Super Intelligence
- **Project lead:** Jark Pruden
- **Repository:** `jark-zenith/Gideon-SI-`

Jark Pruden is the human founder, project lead and final decision maker.

## Current status

**Phase 0 — Architecture & Engineering Foundation**

This repository is deliberately not the finished GIDEON product. The current branch establishes the engineering contracts, security boundary, architecture documentation, decision records, roadmap and a small testable core foundation.

The existing holographic/reference image is preserved and remains the approved visual reference for the future original male GIDEON interface.

Anything not actually implemented must be described as **PLANNED** or **NOT YET IMPLEMENTED**.

## Approved technical baseline

1. Push-to-talk voice for the MVP.
2. Wake word deferred.
3. Supabase for authentication, PostgreSQL and vector capabilities.
4. Cascaded STT → LLM → TTS voice pipeline initially.
5. Realtime speech-to-speech designed as a future pluggable backend.
6. GitHub read-only repository inspection is the first real tool.
7. Model providers are accessed through an abstraction layer.
8. The model proposes actions; it never directly executes tools.
9. Every tool request passes through policy and permission checks.
10. Actual tool execution is audit logged.
11. Sensitive actions require explicit user confirmation.
12. Provider/API secrets remain server-side.
13. No fake functionality.
14. Existing assets are preserved unless deliberate replacement is approved.

## Architecture

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

The client is an untrusted presentation layer. The backend is responsible for identity, provider access, policy enforcement, tool execution and auditability.

## Repository documentation

- [AI agent instructions](AGENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security architecture](docs/SECURITY-ARCHITECTURE.md)
- [Voice architecture](docs/VOICE-ARCHITECTURE.md)
- [Memory architecture](docs/MEMORY-ARCHITECTURE.md)
- [Tool architecture](docs/TOOL-ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [AI development team](docs/AI-TEAM.md)
- [Architecture decisions](docs/DECISIONS/)

## Development commands

The current foundation is TypeScript-only and intentionally has no application runtime yet.

```bash
npm install
npm run typecheck
npm test
```

Do not add dependencies merely to make the repository look complete.

## Environment variables

Use local environment variables or the deployment platform's secret store. Never commit real credentials.

See [.env.example](.env.example). Provider secrets and Supabase service-role credentials are server-only.

## Engineering rule

**Never silently replace the established architecture.**

If implementation reveals a necessary architectural change, document the reason, alternatives, decision and consequences in an ADR before making the change.

## What is not implemented yet

- production authentication
- web application
- production model adapter
- persistent Supabase memory
- realtime voice
- wake word
- holographic runtime
- GitHub repository tool
- autonomous agents
- Android/Desktop control

Those are roadmap items, not current capabilities.
