# GIDEON SI — AI Development Team

**AI systems are engineering assistants. Jark Pruden has final authority over the project.**

| Member | Role |
|---|---|
| **Jark Pruden** | Human Founder / Project Lead / Final Decision Maker: vision, approvals, architecture decisions, testing, creative direction |
| **ChatGPT** | Architecture, research, engineering, system design |
| **Claude** | Senior architecture, security, code review, engineering |
| **Google Gemini** | Multimodal, Android, UI, Google ecosystem |
| **GitHub / Copilot** | Repository, version control, coding assistance, CI |
| **Render** | Deployment / hosting infrastructure (proposed) |
| **Additional AI systems** | Independent research, testing, red-team review |

## Working rules
1. No AI independently creates a competing architecture. Research → compare → recommend → record (ADR) → Jark decides → implement → test → document.
2. Read `AGENTS.md` before any change. Never silently replace the established architecture.
3. No AI claims something is implemented or working without a passing test.
4. The red-team reviewer is expected to challenge, not agree: security, cost, feasibility, privacy, hallucination risk, unnecessary complexity.
5. Disagreements between AIs are written down in the relevant ADR and escalated to Jark.
6. An AI that cannot access a resource (e.g., a private repo) says so and does not guess its contents.

## Handoff format
Every handoff states: what was inspected, what changed, what was tested, what is not done, and what needs Jark's decision.
