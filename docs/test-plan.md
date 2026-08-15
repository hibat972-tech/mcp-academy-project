# Test Plan — To-Do List MCP

| id | tool | setup | input | expected | result | evidence |
|---|---|---|---|---|---|---|
| T1 | add_task | fresh todos.json | `{"title": "Buy groceries", "priority": "medium"}` | New task created with generated id, status "open" | | |
| T2 | add_task | none | `{"title": "", "priority": "medium"}` | Zod rejects: title too short | | |
| T3 | list_tasks | todos.json has 3 open tasks | `{}` | Returns all 3 open tasks | | |
| T4 | list_tasks | todos.json is empty array `[]` | `{}` | Returns `{ tasks: [], count: 0 }`, no crash | | |
| T5 | complete_task | task with id "1" exists and is open | `{"id": "1"}` | Task "1" status becomes "completed" | | |
| T6 | complete_task | none | `{"id": "999"}` (non-existent) | Clean error: "Task with id \"999\" was not found" | | |
| T7 | complete_task | none | `{"id": "../etc/passwd"}` | Rejected safely as not-found, no filesystem access outside `./data` | | |
| T8 | complete_task | none | `{"id": "aaa...aaa"}` (125+ chars) | Zod rejects: id too long (max 100) | | |