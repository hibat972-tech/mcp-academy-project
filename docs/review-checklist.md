# Week 4 Peer Review Checklist

**Reviewer name:** جنين محسن سطوف
**Date:** 12/8/2026
**Project:** To-Do List MCP (add_task, list_tasks, complete_task)

## 1. Schemas & Validation
- Reviewer checked the tool input schemas (Zod)
- Peer's answer / notes: Verified, no issues found.

## 2. Error Handling
- Reviewer checked error handling behavior
- Peer's answer / notes: Verified, worked correctly.

## 3. Secrets
- Reviewer checked overall security handling
- Peer's answer / notes: Verified, no issues found.

## 4. Data Allowlists / Project Structure
- Reviewer checked project structure on GitHub
- Peer's answer / notes:A "list task" file was still visible on the
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
| Item |
|---|
| Leftover "list task" file still visible on GitHub — confirm it is fully removed |
| Add a `deadline` field to the `add_task` tool |
| Improve `list_tasks`: add filtering and sorting by `priority` and `deadline` |

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