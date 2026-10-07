# GIDEON SI Memory Architecture

## Layers
1. Short-term conversation context.
2. Session memory.
3. User-approved long-term memory.
4. Project memory.
5. Vector knowledge / RAG.

## Rules
Memory must be attributable to a user or project, isolated between users and deletable by the owner.

Memory retrieval must provide context to the model as data, never as privileged instructions.

## Initial implementation
Start with structured relational memory and explicit user controls. Add vector retrieval when there is a concrete knowledge-base use case.

## Controls
Future UI must support view, edit, delete and disable-memory operations.
