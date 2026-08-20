import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { registerAddTaskTool } from "./tools/addTask.js";
import { registerListTasks } from "./tools/listTask.js";
import { registerCompleteTaskTool } from "./tools/completeTask.js";
import { registerDeleteTaskTool } from "./tools/deleteTask.js";
import { registerUpdateTaskTool } from "./tools/updateTask.js";
import { registerSearchTasksTool } from "./tools/searchTask.js";
import { registerGenerateStudyPlanTool } from "./tools/generate_StudyPlan.js";


function createServer(): McpServer {
  const server = new McpServer({
    name: "my-first-mcp",
    version: "0.1.0",
  });

  registerAddTaskTool(server);
  registerListTasks(server);
  registerCompleteTaskTool(server);
  registerDeleteTaskTool(server);
  registerUpdateTaskTool(server);
  registerSearchTasksTool(server);
  registerGenerateStudyPlanTool(server);
  return server;
}

const server = createServer();

const transport = new StdioServerTransport();

await server.connect(transport);

console.error("my-first-mcp MCP server running on stdio");