# On-Site Peer Review — Week 4

**Date:** August 12, 2026
**Reviewer:** Duaa Naji — NextFlows Academy MCP Cohort, Student ID 1220336
**Reviewee:** Zainab AbuAwwad, Hiba AbuTaha, Malak Alrimawi
**Project/branch reviewed:** week-4-harden
**Tools demoed:** add_task, list_tasks, complete_task

## Live testing evidence (MCP Inspector)
- `add_task` (valid: title="Buy groceries", priority="medium") → success, returned new task with id, status "open"
- `add_task` (invalid: empty title) → rejected cleanly with Zod validation message ("Too small: expected string to have >=1 characters"), no crash
- `list_tasks` → returned all tasks including the newly added one (count: 3)
- `complete_task` (valid id) → task status updated to "completed"
- `complete_task` (id: `../etc/passwd`) → safely rejected, "not found" message only, confirmed twice in Server Console log, no filesystem access outside the project

## What worked
- Schemas are clear and logical: `title` (1–200), `priority` enum, `id` (1–100), `limit` (int, 1–50) — all documented with `.describe()`
- Error messages are clean and human-readable, with no leaked paths or stack traces
- No secrets or API keys exposed; no network calls; `.env.example` documents this correctly
- Path traversal protection confirmed: `dataFile.ts` resolves all paths under `./data` and rejects escapes; `complete_task` looks up `id` in-memory only, never touching the filesystem by id
- End-to-end flow (`add_task` → `list_tasks` → `complete_task`) is consistent with `docs/design.md` and `docs/threat-model.md`

## Issues found
1. **README.md** — unresolved merge conflict marker (`<<<<<<< HEAD`) left in the middle of the file (**must-fix, blocking**)
2. **Stray file** — unused/duplicate `listTask.ts` at the project root, not referenced anywhere in `src/` (non-blocking)
3. **Error response consistency** — `add_task` and `complete_task` don't include `isError: true` on error responses, unlike `list_tasks` (non-blocking)
4. **Minor input sanitization** — `title` is stored with trailing whitespace as typed (e.g. `"Buy groceries "`); schema doesn't `.trim()` input (minor)

## Recommended fixes
1. Resolve the merge conflict in `README.md` and clean it up before Demo Day
2. Remove the unused `listTask.ts` file at the project root
3. Add `isError: true` to `add_task` and `complete_task` error responses, matching `list_tasks`
4. Add `.trim()` to the `title` field in the `add_task` schema

## Action items

| Action item | Owner | Due date |
|---|---|---|
| Remove unused/duplicate `listTask.ts` file at project root | Zainab | End of Week 4 |
| Add `isError: true` to `add_task` response for consistency with `list_tasks` | Malak | End of Week 4 |
| Add `isError: true` to `complete_task` response for consistency with `list_tasks` | Hiba | End of Week 4 |
| Add `.trim()` to the `title` field in the `add_task` schema | Malak | End of Week 4 |
| Resolve merge conflict and clean up README before Demo Day | Hiba | End of Week 4 |

## Summary
- **Must-fix (blocking):** 1 — README merge conflict
- **Suggested improvements (non-blocking):** 2 — remove stray `listTask.ts` file, standardize `isError: true` across all three tools
- **Overall:** Security hardening (path safety, secrets, input validation) is solid. Remaining issues are cosmetic/consistency, not security risks.