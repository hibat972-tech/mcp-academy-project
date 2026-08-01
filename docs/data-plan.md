# Data Plan

| tool | source | fixture path | auth | failure modes | example response |
|------|--------|--------------|------|---------------|------------------|
| add_task | local file (JSON) | data/tasks.json | none | empty file, invalid JSON, write failure | id: 3  , title: Study MCP Week 4<br>priority: low  , completed: false |
| list_tasks | local file (JSON) | data/tasks.json | none | empty file, invalid JSON, file not found | tasks:<br>id: 1  , title: Finish MCP Week 2<br>priority: high   , completed: true<br><br>id: 2  , title: Study MCP Week 3<br>priority: medium  , completed: false |
| complete_task | local file (JSON) | data/tasks.json | none | task not found, invalid JSON, write failure | id: 1  , title: Finish MCP Week 2<br>priority: high  , completed: true |