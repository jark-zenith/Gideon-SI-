# GIDEON SI Security Architecture

## Trust boundary
The AI model is not a trusted execution environment.

AI MODEL
→ ACTION PROPOSAL
→ POLICY ENGINE
→ PERMISSION CHECK
→ USER CONFIRMATION when required
→ TOOL
→ AUDIT LOG

## Threats
- Prompt injection in websites, repositories and documents.
- API-key leakage.
- Session hijacking.
- Cross-user memory access.
- Memory poisoning.
- Over-permissioned tools.
- Malicious tool arguments.
- Unauthorized consequential actions.
- Voice/privacy leakage.
- Audit tampering.

## Controls
- Server-side secrets.
- Short-lived authenticated sessions.
- Least-privilege tool permissions.
- Read-only defaults.
- Structured tool schemas and validation.
- Explicit confirmation for sensitive actions.
- Per-user database isolation and row-level security.
- Audit events for tool proposals and executions.
- Rate limits and abuse controls.
- External content treated as untrusted data.
- No automatic execution of instructions discovered in external content.

## Data principles
Collect only what the feature needs. Give users visibility and deletion controls for stored memory. Never log secrets, raw authentication tokens or unnecessary sensitive payloads.

## Security testing
Every new tool should have tests for unauthorized access, malformed input, prompt injection, cross-user isolation and failed execution.
