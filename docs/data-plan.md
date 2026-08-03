# Week 3 Data Plan

| tool | source | fixture path | auth | failure modes | example response |
|---|---|---|---|---|---|
| listTasks | local file (JSON) | ./data/todos.json | none | empty file → return `{ "tasks": [] }`; malformed/missing fields in a row → skip that row and log a warning; file not found → return a clear error, don't crash | `{ "tasks": [{ "id": "1", "title": "Buy groceries", "status": "open", "priority": "high", "createdAt": "2026-07-20T10:00:00Z" }] }` |
| addTask | local file (JSON) | ./data/todos.json | none |  empty file → create a new task list and add the task; malformed/missing fields → return a validation error; file not found → create the file and add the task |  `{ "ok": true, "task": { "id": "3", "title": "Study MCP Week 4", "status": "open", "priority": "low", "createdAt": "2026-08-03T12:00:00Z" } } ` |
| completeTask | local file (JSON) | ./data/todos.json | none |  empty file → return a clear error; task id not found → return a clear error; malformed JSON → return a clear error, don't crash |` { "ok": true, "task": { "id": "1", "title": "Finish MCP Week 2", "status": "completed", "priority": "high", "createdAt": "2026-07-15T09:00:00Z" } }` |