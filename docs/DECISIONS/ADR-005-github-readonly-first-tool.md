# ADR-005 — GitHub Read-Only First Tool

## Context

GIDEON is intended to assist with technical projects. Repository inspection is useful while carrying relatively low execution risk when restricted to read-only operations.

## Problem

Which real tool should validate the tool/policy/audit architecture first?

## Alternatives considered

### A. File-system write tool
Useful but immediately creates destructive data-loss risk.

### B. Deployment tool
High consequence and difficult to secure as a first integration.

### C. GitHub read-only repository inspector
Useful technical capability with bounded read-only authority.

## Decision

The first production tool will be a read-only GitHub Repository Inspector.

Planned operations:
- inspect repository;
- list files;
- read files;
- inspect branches;
- inspect commits;
- analyze project structure;
- return structured findings.

## Advantages

- directly useful for development;
- exercises authentication and resource scoping;
- tests untrusted external-content handling;
- avoids repository mutation.

## Disadvantages

- GitHub API rate limits;
- repository permissions and OAuth/App configuration add complexity;
- read-only analysis can still expose sensitive repository content.

## Consequences

Repository contents are always treated as untrusted data. The tool must never convert README, source, issue or commit instructions into privileged GIDEON commands.

No push, delete, pull-request creation or permission modification is part of the initial tool.

## Future reconsideration criteria

Write capabilities may be considered only after:
- read-only tool is stable;
- policy is tested;
- audit logging is reliable;
- resource scopes are explicit;
- user confirmation UX exists;
- security review approves the specific write operation.
