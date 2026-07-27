import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerAddTask } from "./tools/addTask.ts";
import { registerListTasks } from "./tools/listTasks.ts";
import { registerCompleteTask } from "./tools/completeTask.ts";
import { registerDeleteTask } from "./tools/deleteTask.ts";
import { registerSearchTasks } from "./tools/searchTasks.ts";
import { registerSortTasksByPriority } from "./tools/sortTasksByPriority.ts";

function createServer(): McpServer {
  const server = new McpServer({
    name: "todo-list-mcp",
    version: "0.2.0",
  });

  registerAddTask(server);
  registerListTasks(server);
  registerCompleteTask(server);
  registerDeleteTask(server);
  registerSearchTasks(server);
  registerSortTasksByPriority(server);

  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("todo-list-mcp MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});