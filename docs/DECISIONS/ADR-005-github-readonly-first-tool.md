# ADR-005: GitHub Read-Only First Tool

## Decision
GitHub repository inspection is the first real GIDEON tool.

## Reason
It directly supports GIDEON's intended role as a technical operator while allowing a low-risk read-only capability.

## Restrictions
No write operations in the initial tool.

## Consequences
The tool runtime, policy engine and audit log can be tested against a useful real workflow before higher-risk automation is introduced.
