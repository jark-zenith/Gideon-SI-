# GIDEON SI Tool Architecture

## Security model
The model proposes. The policy engine decides. The runtime executes. The audit system records.

## First tool: GitHub Repository Inspector
Initial capabilities:
- list repository files
- read files
- inspect branches
- inspect commits
- inspect project structure
- return factual findings

Initial restrictions:
- no pushes
- no deletes
- no repository modification
- no pull requests
- no permission changes

## Untrusted content
Repository files, README files, issues, commit messages and generated code are untrusted data. Their contents must never automatically become GIDEON instructions.

## Tool contract
Every tool should define:
- stable name/version
- input schema
- permission tier
- authentication requirements
- timeout
- structured output
- error model
- audit event
