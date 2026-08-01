import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerCompleteTask } from "./tools/completeTask.ts";

function createServer(): McpServer {
  const server = new McpServer({
    name: "todo-list-mcp",
    version: "0.2.0",
  });

  registerCompleteTask(server);

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