# Threat Model — To-Do List MCP (PO tools: list_tasks, add_task, complete_task)

## Assets
- `./data/todos.json` — the only data file these tools read/write. Contains task
  id, title, status, priority, createdAt. No PII, no secrets.
- No API keys or tokens are used by this tool group (all local file I/O, no network calls).
- The host filesystem beyond `./data/` — must stay out of reach of these tools.

## Trust boundaries
- **Model → tool arguments**: the model calls `list_tasks`, `add_task`, and
  `complete_task` with arguments it generates itself. These are treated as
  untrusted input, same as an HTTP request body.
- **Tool → filesystem**: `add_task` and `complete_task` write to
  `./data/todos.json`; `list_tasks` only reads it. The file path itself is a
  hardcoded constant in code — it is never built from model input.
- No **tool → network** boundary exists in this group (no fetch/HTTP calls).

## Top 5 risks
1. **Path traversal via task title/id** — if `add_task` or `complete_task`
   ever used user-supplied strings to construct a file path (e.g. per-task
   files), a crafted `title` or `id` like `../../etc/passwd` could escape
   `./data/`. Currently mitigated by design (single fixed JSON file), but
   flagged as a risk if this ever changes.
2. **Oversized `title` in `add_task`** — an extremely long string could bloat
   `todos.json` and blow up the model's context when `list_tasks` later
   returns it.
3. **Runaway response from `list_tasks`** — if `todos.json` grows large
   (many tasks), returning all of them at once could flood the model's
   context window, even with `limit` supplied incorrectly or omitted.
4. **Malformed/invalid `id` in `complete_task`** — a nonexistent or
   malformed `id` could cause a crash or an unclear error if not validated
   before use.
5. **Concurrent writes corrupting `todos.json`** — if `add_task` and
   `complete_task` both write to the same file without any locking, a race
   condition could corrupt the JSON.

## Mitigations this week
1. **Path traversal**: keep the fixture path as a hardcoded constant
   (`resolve(__dirname, "../../../data/todos.json")`), never built from
   model input. No plans to accept a path parameter from the model.
2. **Oversized title**: add a Zod `.max(200)` (or similar) constraint on
   `title` in `add_task`'s input schema, rejecting anything longer before
   the handler runs.
3. **Runaway `list_tasks` response**: `limit` is already capped at
   `.max(50)` via Zod; additionally, if `limit` is omitted, cap the default
   return size (e.g. top 20) rather than returning every open task
   unbounded.
4. **Invalid `id` in `complete_task`**: validate the `id` exists in the
   loaded task list before attempting to mark it complete; return a clean
   `isError: true` response (not a crash) if not found — same pattern
   already used for `list_tasks`'s empty-file case.
5. **Concurrent writes**: out of scope for this week (see below), but noted
   as a known limitation.

## Out of scope
- **File locking / concurrent write safety** — acceptable for a student
  project running one process locally; not worth the complexity this week.
- **Authentication/authorization** — cohort rule is `auth: none`; no user
  accounts exist to protect.
- **Network-based attacks (SSRF, rate limiting, etc.)** — not applicable,
  since this tool group makes no network calls.
- **Encryption at rest for `todos.json`** — contains no sensitive data
  (no PII, no secrets), so unnecessary for this scope.