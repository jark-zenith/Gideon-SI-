# GIDEON SI — Tool Architecture

Status: DESIGN ONLY. **NOT YET IMPLEMENTED.**

## 1. Standard tool interface (illustrative TypeScript)
```ts
type RiskTier = 'INFORMATION' | 'REVERSIBLE' | 'SENSITIVE' | 'HIGH_RISK';

interface GideonTool<I, O> {
  name: string;                       // stable id, e.g. 'github.repo.read_file'
  description: string;                // shown to the model and to the user
  inputSchema: JsonSchema;            // validated server-side before anything runs
  outputSchema: JsonSchema;
  riskTier: RiskTier;
  requiredScopes: string[];           // e.g. ['github:read']
  limits: { timeoutMs: number; maxOutputBytes: number; rateLimitPerMin: number };
  execute(ctx: ToolContext, input: I): Promise<ToolResult<O>>;
}

interface ToolResult<O> {
  status: 'ok' | 'error' | 'denied';
  data?: O;
  provenance: { source: string; untrusted: true };   // external content is always untrusted
  error?: { code: string; message: string };          // never fabricated success
}
```
`ToolContext` carries the verified `userId`, `sessionId`, granted scopes and a scoped credential handle — never raw provider secrets.

## 2. Request flow
1. Model emits a **proposal** `{tool, args, rationale}`.
2. Tool Runtime resolves the tool; validates `args` against `inputSchema` (reject on mismatch).
3. **Policy Engine** evaluates: user, session, tool, tier, args, recent context (e.g., untrusted content just entered), rate limits.
4. Outcome: `ALLOW` · `DENY` · `REQUIRE_CONFIRMATION`.
5. If confirmation is required, the UI shows tool + exact args; the user's approval is recorded and bound to those args and an expiry.
6. Tool executes inside its sandbox with timeout/size limits.
7. Result is redacted, tagged untrusted, returned to the model as data.
8. **Audit record** written for proposal, decision, confirmation (if any), execution and result status.
The model's `rationale` is displayed but never used as a permission signal.

## 3. Permission model
- **Deny by default.** A tool is usable only if the user (or admin) has granted its scopes.
- Grants are per user, optionally per session and per resource (e.g., specific repositories).
- Tiers: INFORMATION and read-only tools may auto-run once granted; REVERSIBLE needs permission; SENSITIVE needs explicit per-action confirmation; HIGH_RISK is denied in MVP.
- Context escalation: after untrusted external content enters the context, tools of tier REVERSIBLE or above require confirmation even if previously auto-allowed (PLANNED policy rule).
- Revocation is immediate and audited.

## 4. Audit record (minimum fields)
`id, ts, user_id, session_id, tool, args_hash, args_redacted, decision (allow/deny/confirm), policy_reason, confirmation_id, status, duration_ms, result_summary, prev_hash, hash`. Raw file contents and secrets are never stored. Insert-only, hash-chained (see SECURITY-ARCHITECTURE #13).

## 5. First tool: GITHUB REPOSITORY INSPECTOR — READ ONLY
Tools (all `INFORMATION` tier, scope `github:read`) — all **PLANNED**:
| Tool | Purpose |
|---|---|
| `github.repo.info` | Repo metadata |
| `github.repo.list_files` | Tree listing (path, size) |
| `github.repo.read_file` | Read a file (size-capped, text only) |
| `github.repo.branches` | List branches |
| `github.repo.commits` | Recent commits |
| `github.repo.analyze_structure` | Summarize layout, languages, manifests (deterministic code, then model summary) |

**Credentials:** GitHub App installation or fine-grained token with *read-only* Contents + Metadata, restricted to user-selected repositories; stored server-side encrypted; never sent to client or model.
**Explicitly absent:** push, commit, delete, branch creation, PRs, issue/comment writes, permission or webhook changes. No code path may call a GitHub write endpoint; a test asserts the HTTP client's allowed methods/paths are read-only.
**Untrusted content:** file contents, READMEs, issues and commit messages are wrapped as data (`provenance.untrusted = true`) and presented to the model in a clearly delimited data channel. Instructions found inside never trigger actions; a "malicious README" test is required.
**Hardening:** max file size, max files per call, binary skip, path normalization, rate-limit handling, secret-pattern redaction before content reaches the model or logs.
**Honest reporting:** the assistant may say "I analyzed the repository" only if an audit record of a successful inspector run exists for that turn.

## 6. Adding a tool
New tool = new file implementing `GideonTool`, schema tests, policy tier justification, audit coverage, security review note in the PR, entry in this document. Write-capable tools require an ADR and Jark's approval.
