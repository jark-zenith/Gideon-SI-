# GIDEON SI — Security Architecture

## 1. Security objective

GIDEON must remain useful without allowing untrusted model output or external content to gain authority over the user's systems or data.

The central rule is:

> **The AI model is not a trusted execution environment.**

## 2. Mandatory execution boundary

```
AI MODEL
    ↓
ACTION PROPOSAL
    ↓
POLICY ENGINE
    ↓
PERMISSION CHECK
    ↓
USER CONFIRMATION IF REQUIRED
    ↓
TOOL
    ↓
AUDIT LOG
```

No model response may invoke a privileged tool directly.

## 3. Threat model

### Prompt injection

Attackers may place instructions in user prompts or external content intended to manipulate GIDEON.

Control:
- isolate instructions from data;
- treat retrieved content as untrusted;
- use structured tool calls;
- enforce policy outside the model.

### Malicious web content

A website may contain text such as "ignore previous instructions".

Control:
- web content is data;
- retrieved pages cannot modify system policy;
- tool arguments are independently validated.

### Malicious GitHub content

Repositories may contain hostile README text, comments, source code, issue descriptions or commit messages.

Control:
- repository data is untrusted;
- the GitHub inspector is read-only;
- repository text cannot authorize actions.

### Malicious uploaded documents

Documents may contain prompt injection, misleading instructions or malicious links.

Control:
- parsing is sandboxed where appropriate;
- document content is labeled untrusted;
- no action is authorized merely because a document requests it.

### API-key exposure

Control:
- secrets are server-side;
- frontend receives only public configuration;
- secret values are never logged;
- `.env` is ignored by Git.

### Authentication attacks

Threats include credential stuffing, token theft and session abuse.

Control:
- managed authentication;
- short-lived/session-aware credentials;
- rate limits;
- server-side authorization;
- logout/revocation support.

### Session hijacking

Control:
- secure session handling;
- HTTPS in deployment;
- server-side identity derivation;
- do not accept arbitrary user IDs from clients as authority.

### Unauthorized tool execution

Control:
- registered tools only;
- policy decision required;
- confirmation for sensitive tiers;
- audit event for proposal and execution.

### Memory poisoning

Attackers may attempt to plant false or malicious long-term memories.

Control:
- user/project ownership;
- explicit memory write policy;
- provenance;
- user visibility;
- deletion;
- never treat memory as privileged instructions.

### Cross-user data leakage

Control:
- authenticated user scoping;
- PostgreSQL row-level security;
- server-side authorization;
- tests for tenant isolation;
- project-level access checks.

### Excessive permissions

Control:
- least privilege;
- read-only defaults;
- narrow tool scopes;
- high-risk capabilities disabled by default;
- explicit confirmation.

### Voice privacy

Control:
- push-to-talk for MVP;
- no always-on microphone;
- clear listening indicator;
- microphone permission at the client;
- audio retention minimized;
- future wake-word design should prefer local detection where practical.

### Audit-log tampering

Control:
- server-side logging;
- restricted write access;
- append-oriented records;
- no model-controlled deletion;
- future integrity/retention strategy.

### Insecure autonomous agents

Control:
- agents are deferred;
- no autonomous high-risk actions;
- bounded workflows;
- explicit approval gates;
- per-step policy;
- execution verification.

## 4. Data classification

At minimum classify:
- public;
- user-private;
- project-private;
- authentication/security-sensitive;
- provider-secret.

Secrets must never enter model prompts unless a narrowly designed feature requires it, and provider secrets must never be exposed to the client.

## 5. External data rule

External content is **untrusted data, not instructions**.

This applies to:
- websites;
- repositories;
- issues;
- commits;
- uploaded documents;
- search results;
- third-party API responses.

## 6. Failure posture

For privileged actions, ambiguous state must fail closed.

GIDEON should prefer:
- "I cannot verify this" over a fabricated success;
- "confirmation required" over silent execution;
- "tool failed" over pretending success.

## 7. Security testing

Every tool should have tests for:
- unauthorized access;
- malformed input;
- permission bypass;
- prompt injection;
- malicious external content;
- cross-user isolation;
- failure handling;
- audit logging.

Security review is required before enabling a new privileged action tier.
