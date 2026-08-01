# Week 3 Data Plan

| tool | source | fixture path | auth | failure modes | example response |
|---|---|---|---|---|---|
| list_tasks | local file (JSON) | ./data/todos.json | none | empty file → return `{ "tasks": [] }`; malformed/missing fields in a row → skip that row and log a warning; file not found → return a clear error, don't crash | `{ "tasks": [{ "id": "1", "title": "Buy groceries", "status": "open", "priority": "high", "createdAt": "2026-07-20T10:00:00Z" }] }` |
| add_task | local file (JSON) | ./data/todos.json | none | TBD — owner to fill (e.g. empty file, bad JSON, duplicate id, missing title) | TBD — owner to fill |
| complete_task | local file (JSON) | ./data/todos.json | none | TBD — owner to fill (e.g. task id not found, already completed, empty file) | TBD — owner to fill |