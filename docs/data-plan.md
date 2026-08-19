# Week 3 Data Plan

| tool | source | fixture path | auth | failure modes | example response |
|---|---|---|---|---|---|
| list_tasks | local file (JSON) | ./data/todos.json | none | empty file → return `{ "tasks": [] }`; malformed/missing fields in a row → skip that row and log a warning; file not found → return a clear error, don't crash | `{ "tasks": [{ "id": "1", "title": "Buy groceries", "status": "open", "priority": "high", "createdAt": "2026-07-20T10:00:00Z" }] }` |
| add_task | local file (JSON) | ./data/todos.json | none |  empty file → create a new task list and add the task; malformed/missing fields → return a validation error; file not found → create the file and add the task |  `{ "id": "3", "title": "Study MCP Week 4", "priority": "low", "completed": false }` |
| complete_task | local file (JSON) | ./data/todos.json | none |  empty file → return a clear error; task id not found → return a clear error; malformed JSON → return a clear error, don't crash | `{ "id": "1", "title": "Finish MCP Week 2", "priority": "high", "completed": true }` |
