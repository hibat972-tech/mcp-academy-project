# Data Plan

| tool | source | fixture path | auth | failure modes | example response |
|------|--------|--------------|------|---------------|------------------|
| add_task | tasks.json | data/tasks.json | none | empty file, invalid JSON, write failure | id: 3, title: Study MCP Week 4, priority: low, completed: false |
| list_tasks | tasks.json | data/tasks.json | none | empty file, invalid JSON, file not found | tasks: [id: 1, title: Finish MCP Week 2, priority: high, completed: true; id: 2, title: Study MCP Week 3, priority: medium, completed: false] |
| complete_task | tasks.json | data/tasks.json | none | task not found, invalid JSON, write failure | id: 1, title: Finish MCP Week 2, priority: high, completed: true |