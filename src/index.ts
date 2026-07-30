import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerAddTaskTool } from "./tools/addTask.js";


function createServer(): McpServer {
  const server = new McpServer({
    name: "my-first-mcp",
    version: "0.1.0",
  });

  registerAddTaskTool(server);

  return server;
}

const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("my-first-mcp MCP server running on stdio");