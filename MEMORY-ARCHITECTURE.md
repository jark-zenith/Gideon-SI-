# GIDEON SI — Memory Architecture

Status: DESIGN ONLY. **NOT YET IMPLEMENTED.** Multi-user isolation is designed in from day one.

## 1. Layers
| Layer | What is stored | Why | Where | Retrieval | Deletion |
|---|---|---|---|---|---|
| **1. Short-term context** | Recent turns of the current conversation | Coherent dialogue | In-request context window (+ conversation rows) | Last N turns / token budget | With conversation deletion |
| **2. Session memory** | Task state for the current session (goal, selected repo, pending confirmations) | Continuity inside a task | `sessions` table, expires | By session ID | Auto-expiry; user clear |
| **3. Long-term user memory** | User-approved facts and preferences | Personalization | `memory_items` (kind=`user`) | Keyword + semantic search, filtered by `user_id` | User delete = hard delete incl. embedding |
| **4. Project memory** | Facts scoped to a project (decisions, conventions) | Project continuity | `memory_items` (kind=`project`, `project_id`) | Filtered by user + project | User delete / project delete cascade |
| **5. Vector knowledge / RAG** | Chunks + embeddings from user-uploaded docs | Answering from the user's own material | `knowledge_chunks` (pgvector), source files in storage | Embedding similarity with mandatory `user_id` (+ project) filter | Delete source → delete chunks, embeddings, files |

MVP includes layers 1–3 only (layer 3 with approval flow). Layers 4–5 are PLANNED (Phase 6+).

## 2. Write policy (anti-poisoning)
- GIDEON may *propose* a memory; it is stored only after the user approves (or the user states it explicitly and asks to remember).
- Content originating from external sources (web, repos, documents) is never auto-saved as a fact. Provenance (`source`, `created_by`, `conversation_id`) is stored on every item.
- Memory text is retrieved as **untrusted data**: it informs answers but cannot grant permissions or issue instructions.

## 3. Isolation
- Every table carries `user_id uuid not null` defaulting to `auth.uid()`.
- Row Level Security enabled on all tables: `using (user_id = auth.uid())` for select/update/delete, `with check (user_id = auth.uid())` for insert/update.
- Vector queries run in the database with the same RLS (or a security-definer function that hard-codes the `user_id` filter). Never retrieve first and filter in app code.
- The service-role key is server-only and used only by narrowly scoped server code; the user ID always comes from the verified token.
- CI test: user A cannot read, update, delete or retrieve-by-similarity user B's rows.

## 4. Sketch (illustrative, not a migration)
```sql
create table memory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (kind in ('user','project')),
  project_id uuid null,
  content text not null,
  source text not null,            -- 'user_stated' | 'user_approved_proposal' | ...
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  embedding vector(1536) null      -- dimension depends on the embedding model chosen
);
alter table memory_items enable row level security;
```

## 5. User controls (PLANNED)
View · search · edit · delete · disable memory (global toggle; when off, nothing is read or written) · export (JSON). Every memory read/write that influences a response is auditable.

## 6. Deletion semantics
Deletion removes the row, its embedding and derived chunks. Backups age out per Supabase retention; document this honestly in the privacy notes. Account deletion cascades.

## 7. Minimization
Do not store secrets, government IDs, or payment numbers. The Safety Layer blocks proposals matching secret/ID patterns.

## 8. Open items
Embedding model/dimension, chunking strategy, retention windows for sessions and conversations — decide in Phase 6.
