# Design: To-Do List MCP

## Pitch
Many people rely on scattered notes, sticky notes, or memory to track their daily tasks, which leads to forgotten to-dos and poor prioritization. This MCP exposes a simple to-do list as a set of tools an AI assistant can call directly, letting the user manage their daily tasks through natural conversation instead of a separate app. It targets everyday users who want a lightweight way to add, review, complete, and prioritize tasks without opening another tool. The MCP focuses on core task management only, with basic priority-based sorting.

## User & Demo Story
On Demo Day, the user says: "Add a task to finish the cryptography assignment by Friday, high priority." The assistant calls `add_task` with the title and priority, and confirms the task was created. The user then asks: "What's on my list?" — the assistant calls `list_tasks` and reads back the open tasks, sorted by priority. After finishing the assignment, the user says "Mark the cryptography task as done," and the assistant calls `complete_task` with the matching task ID, confirming the update. This shows the full add → view → complete loop working live.

## Tool Inventory

| tool_name | description (1 line) | inputs | output (shape) | priority |
|---|---|---|---|---|
| `add_task` | Creates a new task with a title and priority | `title: string`, `priority: "low"\|"medium"\|"high"` | `{ id: string, title: string, priority: string, status: "pending" }` | P0 |
| `list_tasks` | Returns all open (pending) tasks | *(none)* | `{ tasks: Task[] }` | P0 |
| `complete_task` | Marks an existing task as done by ID | `id: string` | `{ id: string, status: "done" }` | P0 |
| `delete_task` | Removes a task permanently by ID | `id: string` | `{ id: string, deleted: true }` | P1 |
| `search_tasks` | Finds tasks matching a keyword in the title | `query: string` | `{ tasks: Task[] }` | P1 |
| `sort_tasks_by_priority` | Returns all tasks ordered from high to low priority | *(none)* | `{ tasks: Task[] }` | P1 |

## Out of Scope
- No user authentication or multi-user accounts — single local task list only.
- No paid or external APIs (no cloud sync, no notifications service).
- No mobile or graphical UI — interaction is through the MCP tools only.
- No recurring tasks or calendar integration.

## Success Criteria
- [ ] `add_task` creates a task and it appears in `list_tasks` output.
- [ ] `complete_task` changes a task's status to "done" and it no longer appears in the default open-tasks list.
- [ ] All 3 P0 tools are visible and callable in MCP Inspector with valid Zod schemas.

## Risks
1. **Risk:** In-memory storage means all tasks are lost when the server restarts. **Mitigation:** Keep a small JSON file as simple persistence if time allows; otherwise clearly state this limitation on Demo Day.
2. **Risk:** Task IDs may be hard to reference in natural conversation (user doesn't know the ID). **Mitigation:** Have `list_tasks` return short, memorable IDs, and let `complete_task`/`delete_task` also accept a partial title match as a fallback.

## Notes from reading Filesystem MCP Server

- Tool names follow strict `verb_noun` snake_case, same as our project: `list_directory`, `read_text_file`, `get_file_info`, `list_allowed_directories`.
- Descriptions are short, one-line, and action-first ("Get detailed file/directory metadata") — no filler words like "This tool will...".
- Every tool sets explicit MCP annotations (e.g. `readOnlyHint: true`, `openWorldHint: false`) so clients can tell read-only tools from write-capable ones at a glance, similar to how our `add_task` vs `list_tasks` should be distinguished.
- Inputs are documented field-by-field right in the README (e.g. `path (string)`), matching how we use `.describe()` per field in our Zod schemas.
- Output shape is spelled out explicitly for each tool (e.g. exact JSON fields returned by `list_directory`), which pushed me to double check our own `output (shape)` column in the tool inventory table is equally precise.