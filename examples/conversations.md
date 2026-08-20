# Example Conversations — To-Do List MCP

## Conversation A: Adding a task

**User prompt:**
> "Add a task to finish the cryptography assignment by Friday, high priority."

**Expected tool call(s):**
1. `add_task` with `{ "title": "Finish cryptography assignment", "priority": "high", "deadline": "2026-08-21" }`

**Good final answer:**
> "Done! I've added 'Finish cryptography assignment' to your list, marked as high priority with a deadline of August 21."

---

## Conversation B: Checking the list

**User prompt:**
> "What's on my to-do list right now?"

**Expected tool call(s):**
1. `list_tasks` with `{ "limit": 10 }`

**Good final answer:**
> "You have 2 open tasks: 'Finish cryptography assignment' (high priority, due Aug 21) and 'Study for week 5' (medium priority, due Aug 20)."

---

## Conversation C: Completing a task

**User prompt:**
> "I finished the cryptography assignment, mark it as done."

**Expected tool call(s):**
1. `list_tasks` with `{}` — to find the task and get its ID, since the user referred to it by name, not ID
2. `complete_task` with `{ "id": "1" }` — using the ID found in step 1

**Good final answer:**
> "Nice work! I've marked 'Finish cryptography assignment' as completed."

---

## Tools covered
- `add_task` (Conversation A)
- `list_tasks` (Conversations B and C)
- `complete_task` (Conversation C)