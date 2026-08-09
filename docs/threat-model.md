# Threat Model — To-Do List MCP

## Assets
- `./data/todos.json` — the only persisted data; contains task titles, priorities, and status (no personal or sensitive info).
- The server process itself and the local filesystem it runs on.
- No API keys, tokens, or secrets are used anywhere in this project.

## Trust Boundaries
- **Model → tool arguments**: the AI model calls `add_task`, `list_tasks`, and `complete_task` with arguments it generates — these are treated as untrusted input.
- **Tool → filesystem**: all three tools read/write `data/todos.json` through a shared helper (`dataFile.ts`).
- **Tool → network**: none — this project makes no outbound network calls, so no external trust boundary exists here.

## Top 5 Risks
1. **Path traversal via file access** — a tool could be tricked into reading/writing outside `./data` if the file path isn't resolved safely.
2. **Runaway response size** — `list_tasks` could return an unbounded number of tasks if `limit` isn't capped, flooding the model's context.
3. **Malformed/invalid task data** — a corrupted or hand-edited `todos.json` (e.g. invalid JSON, missing fields) could crash the server instead of failing cleanly.
4. **Unbounded string input** — `add_task`'s `title` field could be arbitrarily long, bloating storage and responses.
5. **Silent data loss on write failure** — if `writeDataFile` fails partway (e.g. disk full), the todo list could end up corrupted or truncated.

## Mitigations This Week
1. Path traversal — `dataFile.ts` already resolves paths under `./data` and rejects any path escaping it (`..`); will add a unit-style manual test to confirm.
2. Runaway response size — enforce a hard cap on `limit` in `list_tasks` (e.g. max 50) via Zod `.max()`, even if the caller passes a larger number.
3. Malformed data — already caught via `todoListSchema.safeParse()` in `loadTodoList()`, which throws a clear error instead of crashing; will add a matching test case with intentionally broken JSON.
4. Unbounded input — `title` already has `.min(1).max(200)` via Zod; will double-check this is enforced consistently across all tools that accept text.
5. Write failure — out of scope for this week (see below), but will document the risk clearly.

## Out of Scope
- Concurrent write conflicts (multiple simultaneous writes to `todos.json`) — acceptable for a single-user student demo project with no concurrent access.
- Authentication/authorization — not needed since there are no user accounts or multi-tenant data.
- Atomic file writes / crash-safe persistence — acceptable risk for a Demo Day fixture-based project, not production data.

## Verified This Week

- **Path traversal**: tested `complete_task` with `id: "../etc/passwd"` in Inspector — treated as a normal (non-existent) task ID, returned "not found" without touching the filesystem outside `./data`. `dataFile.ts`'s `resolveDataPath()` already enforces this.
- **Unbounded input**: tested `complete_task` with a 125-character `id` — rejected by Zod (`too_big`, max 100) before reaching any handler logic.