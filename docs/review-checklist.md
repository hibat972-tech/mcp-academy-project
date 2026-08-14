# Week 4 Peer Review Checklist

**Reviewer name:** جنين محسن سطوف
**Date:** 12/8/2026
**Project:** To-Do List MCP (add_task, list_tasks, complete_task)

## 1. Schemas & Validation
- Reviewer checked the tool input schemas (Zod)
- Peer's answer / notes: Verified by running `add_task` with an empty
  `title` and `list_tasks` with a negative `limit` — both were rejected
  cleanly by Zod validation before reaching the tool logic. See "Tool-level
  testing notes" below for the exact inputs and outputs.

## 2. Error Handling
- Reviewer checked error handling behavior
- Peer's answer / notes: Verified by triggering both a validation error
  (`add_task` with empty title) and a not-found error (`complete_task`
  with a nonexistent id). Both returned short, clear messages with no
  stack trace or internal file paths exposed. See "Tool-level testing
  notes" below.

## 3. Secrets
- Reviewer checked overall security handling
- Peer's answer / notes: Verified — the project uses no API keys, tokens,
  or credentials. Confirmed that error messages never leak internal
  details that could help an attacker (no file paths, no stack traces).

## 4. Data Allowlists / Project Structure
- Reviewer checked project structure on GitHub
- Peer's answer / notes: A "list task" file was still visible on the
  GitHub interface. The team mentioned it had already been removed, but
  it was still appearing. Recommended ensuring it is completely removed
  if it is no longer needed.

## 5. README / Docs
- Peer's answer / notes: No negative notes reported.

## 6. Demo Path / Overall Functionality
- All 3 P0 tools were demoed and reviewed
- Peer's answer / notes: The project worked well overall. No major
  issues were found.

## Action Items (must-fix)
| Item | Owner | Due date |
|---|---|---|
| Leftover "list task" file still visible on GitHub — confirm it is fully removed | Malak | Done (12/8/2026) |
| Add a `deadline` field to the `add_task` tool, in addition to the existing `priority` field | Malak | Done (12/8/2026) |
| Improve `list_tasks`: add filtering and sorting by `priority` and `deadline` |  Zainab| Done (12/8/2026) |

## Tool-level testing notes (live session with reviewer)

*(Re-verified after the review session to confirm exact request/response
values for this document; same test cases demonstrated live to the
reviewer.)*

1. `add_task` — valid case
   Input: `{ "title": "Study for exam", "priority": "high", "deadline": "2026-08-20" }`
   Result: `{ "ok": true, "task": { "id": "3", "title": "Study for exam", "status": "open", "priority": "high", "deadline": "2026-08-20" } }`
   → Task was created successfully and confirmed present in `data/todos.json`.

2. `add_task` — invalid case (empty title)
   Input: `{ "title": "", "priority": "low", "deadline": "2026-08-20" }`
   Result: rejected with a Zod validation error (`too_small`, "expected string
   to have >=1 characters"). No task was created, and no internal file
   paths or stack trace were exposed in the error message.

3. `complete_task` — valid case
   Input: `{ "id": "1" }`
   Result: `{ "ok": true, "task": { "id": "1", "status": "completed", ... } }`
   → Task status updated correctly.

4. `complete_task` — invalid case (negative/nonexistent id)
   Input: `{ "id": "-1" }`
   Result: `Could not complete task: Task with id "-1" was not found` — clean,
   short error message, no crash, no internal details exposed.

5. `list_tasks` — valid case
   Input: `{ "limit": 5 }`
   Result: `{ "tasks": [...], "count": 2 }` — returned open tasks sorted by
   deadline and priority, as suggested by the reviewer (Jinan) and
   implemented after her feedback.

6. `list_tasks` — invalid case (negative limit)
   Input: `{ "limit": -5 }`
   Result: rejected with a Zod validation error (`too_small`, "expected
   number to be >0"). No data returned, no internal details exposed.

## Follow-up on reviewer's suggestions
- Added `deadline` field to `add_task` (was: title + priority only).
- `list_tasks` now sorts results by priority and deadline instead of
  raw storage order, as recommended by the reviewer.
- Confirmed no sensitive internal details (file paths, stack traces)
  are ever included in error responses — important since inputs come
  from a model, not a trusted user.

## Overall notes

**What worked well:**
The project is well implemented overall. The reviewer verified the tool
schemas, security, error handling, project structure, and general
functionality, and did not find any major issues.

**Issues found:**
No major issues. The reviewer's notes were suggestions for improvement
rather than fixes for real problems:
- A leftover "list task" file was still visible on GitHub even though
  the team said it had been removed.
- The `add_task` tool could benefit from a `deadline` field alongside
  `priority`.
- The `list_tasks` tool only supports a `limit` parameter and returns
  tasks in stored order; adding filtering and sorting by priority and
  deadline (e.g. "high-priority tasks due within the next two days")
  would make it more practical for users to focus on what's urgent.

**Recommended fixes:**
1. Confirm the leftover list-task file is fully deleted from the repo.
2. Add a `deadline` field to `add_task`.
3. Add filtering/sorting options (by priority and deadline) to `list_tasks`.

Overall, the project was well implemented. The reviewer found no fundamental problems, and the suggested changes are primarily improvements to enhance usability.