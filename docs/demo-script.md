# Demo Script — To-Do List MCP Server

**Total time: 5 minutes**

## 0:00–0:40 — The Problem
Students juggle deadlines across multiple courses (exams, assignments, labs) with no single place to track what's open, what's urgent, and what's done. This MCP server lets an AI assistant manage a student's to-do list directly through natural conversation — add tasks, check what's pending, mark things complete — without opening a separate app.

## 0:40–1:10 — Architecture (one slide)
- MCP server (TypeScript, `@modelcontextprotocol/sdk`) running over stdio
- Tasks stored in `data/todos.json`
- Tools registered in `src/tools/`: `addTask`, `listTask`, `completeTask`, `deleteTask`, `updateTask`, `searchTask`, `generate_StudyPlan`
- Client (e.g. Claude / MCP Inspector) calls tools, server reads/writes JSON, returns structured results

## 1:10–3:30 — Live tool calls
**Prompt 1 (add_task):**
> "Add a task to finish the cryptography assignment by Friday, high priority."
→ Calls `add_task`, confirms task was added with title, priority, deadline.

**Prompt 2 (list_tasks + complete_task):**
> "I finished the cryptography assignment, mark it as done."
→ Calls `list_tasks` to find the task's ID, then `complete_task` to mark it completed. Also demonstrates `list_tasks` output when asked "What's on my to-do list right now?" as a natural follow-up.

**Backup prompt (if something above fails):**
> "Update the deadline of the cryptography task to next Monday, then actually just delete it — I don't need it anymore."
→ Calls `update_task` to change the deadline, then calls `delete_task` to remove it.

## 3:30–4:30 — What I'd build next
- Improve the search feature to better understand more complex natural language requests.
- Add reports or summaries about completed and remaining tasks.
- Support recurring tasks
- Smarter study plan generation (e.g. balancing load across days, not just sorting by deadline)

## 4:30–5:00 — Ready for questions