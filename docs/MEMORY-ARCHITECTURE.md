# GIDEON SI — Memory Architecture

## 1. Principle

Memory is a user-controlled data service, not an invisible model capability.

Every persistent memory item must have an owner and, where relevant, a project scope.

## 2. Memory layers

### 1. Short-term conversation context

**Purpose:** current turn and recent conversation.

**Storage:** request/session state.

**Lifetime:** short-lived and bounded.

**Retrieval:** directly supplied to the current model request.

### 2. Session memory

**Purpose:** facts needed to complete the current task/session.

**Storage:** PostgreSQL session/conversation records.

**Retrieval:** scoped to authenticated user and session.

### 3. Long-term user memory

**Purpose:** user-approved stable preferences, facts and working context.

**Storage:** PostgreSQL structured memory records.

**Retrieval:** filtered by authenticated user.

### 4. Project memory

**Purpose:** information belonging to a specific project.

**Storage:** PostgreSQL records linked to a project and owner.

**Retrieval:** authenticated user + project authorization.

### 5. Vector knowledge / RAG

**Purpose:** semantic retrieval from authorized documents, project knowledge and other approved sources.

**Storage:** PostgreSQL with vector capabilities as approved in the baseline.

**Retrieval:** vector similarity followed by authorization filtering and relevance controls.

## 3. Multi-user isolation

Every persistent memory record must carry ownership context.

Expected pattern:

```
user
 └── projects
      └── memories / knowledge
```

Authorization must be enforced server-side and by database policy where supported.

Never trust a client-supplied user ID to determine ownership.

## 4. Retrieval safety

Retrieved memory is context/data.

It must never be treated as privileged system instructions.

External or user-generated text stored in memory remains untrusted unless a separate trusted policy explicitly says otherwise.

## 5. Memory writes

Memory writes should have:
- source/provenance;
- owner;
- scope;
- created/updated timestamps;
- optional confidence;
- deletion state where required.

Do not automatically persist arbitrary conversation content merely because it was mentioned.

## 6. User controls

Planned controls:
- view memory;
- search memory;
- edit memory;
- delete individual memories;
- delete project memory;
- disable memory;
- export memory where technically and legally appropriate.

## 7. Deletion

Deletion must be authenticated and owner-scoped.

When vector representations exist, deletion must cover both:
- the source record;
- its associated embedding/vector entry.

Retention and backups must be documented before production.

## 8. Current implementation

Structured persistent memory, vector retrieval and the memory management UI are **NOT YET IMPLEMENTED**.
