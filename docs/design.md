## Pitch 
Students often struggle to organize their assignments, exams and study schedule in one place. This project provides a smart To-Do List powered by the MCP. The MCP server exposes tools that allow an AI assistant to manage tasks, display task lists and generate study plans. The goal is to help students stay organized and prepare for exams more effectively.

## User & Demo Story
A student says -> Add my exam schedule for this semester. The AI uses the add_task tool to save the exams. Then the student asks -> Show me my upcoming exams and the AI uses list_tasks.                                 Finally, the student asks -> Create a study plan for my exams and the AI uses generate_study_plan to create a simple daily study schedule.

## Tool Inventory

| Tool Name | Description | Inputs | Output  | Priority |
|-----------|-------------|--------|----------------|----------|
| add_task | Add a new task or exam | title, date, priority | Task object | P0 |
| list_tasks | Display all saved tasks | optional filter | List of tasks | P0 |
| complete_task | Mark an existing task as completed | task_id | Updated task | P0 |
| delete_task | Remove a task | task_id | delete the task in list | P1 |
| search_tasks | Search tasks by title keyword | keyword | List of matching tasks | P1 |
| sort_tasks_by_priority | Sort tasks from high to low priority | none | Sorted list of tasks | P1 |
| update_task | Edit an existing task | task_id, new values | Updated task | P2 |
| generate_study_plan | Create a study plan based on exams | task list, exam dates | Study plan | P2 |

## Out of Scope
* User authentication and login system.
* Mobile application development.
* Integration with paid APIs or cloud services.

## Success Criteria
* The user can add a new task successfully.
* The AI can display the current task list.
* The AI can generate a basic study plan from saved tasks.

## Risks
Risk : I may not finish all tools before Demo Day.
Mitigation: I will complete all P0 tools first.