# To-Do List MCP

An MCP (Model Context Protocol) server that lets an AI assistant manage a simple to-do list: add tasks, list open tasks, and mark tasks as completed. Built as part of the NextFlows Academy MCP cohort.

## Requirements

- Node.js v18.12.1 or later
- npm (comes with Node.js)

## Install

```bash
git clone https://github.com/hibat972-tech/mcp-academy-project.git
cd mcp-academy-project
git checkout week-5-docs
npm install
```

## Run

```bash
npm run dev
```

You should see:

my-first-mcp MCP server running on stdio
The server stays running and waits for a client to connect over stdio. Stop it with `Ctrl+C`.

## Inspect it with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Copy the full URL printed in the terminal (it includes an auth token, e.g. `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...`) and open it in your browser. Click **Connect**, then **List Tools**.

## Tools

| Tool | Description | Example Input |
|---|---|---|
| `add_task` | Creates a new task with a title, priority, and deadline | `{"title": "Buy groceries", "priority": "medium", "deadline": "2026-08-20"}` |
| `list_tasks` | Lists all open (pending) tasks | `{"limit": 10}` |
| `complete_task` | Marks an existing task as done by its ID | `{"id": "1"}` |

## Example Prompts

- "Add a task to finish the report by Friday, high priority."
- "What's on my to-do list right now?"
- "Mark task 2 as done."

## Troubleshooting

**"Cannot find module" errors on startup**
Run `npm install` again to make sure all dependencies are installed, then retry `npm run dev`.

**Inspector shows "Connection error" or "Not connected"**
Close the browser tab, stop the terminal process (`Ctrl+C`), restart Inspector, and open the *new* URL it prints (the auth token changes each time — don't reuse an old tab).

**A tool call is rejected with a Zod validation error**
This is expected behavior, not a bug — check the error message for the exact field and rule that failed (e.g. `title` must be 1–200 characters, `priority` must be `low`/`medium`/`high`).

## License

This is a student academy project for educational purposes.