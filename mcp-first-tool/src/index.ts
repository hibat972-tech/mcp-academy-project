import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { registerListTasks } from "./tools/listTasks.js";

function createServer(): McpServer {
  const server = new McpServer({
    name: "mcp-first-tool",
    version: "0.2.0",
  });

  registerListTasks(server);

  return server;
}

void serveStdio(createServer);
console.error("mcp-first-tool MCP server running on stdio");