import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { addTaskInputSchema } from "../schemas/index.ts";

export function registerAddTask(server: McpServer) {
  server.registerTool(
    "add_task",
    {
      description: "Creates a new task with a title and priority",
      inputSchema: addTaskInputSchema,
    },
    async (input) => {
      // Week 2: stub only — Week 3 replaces this with real data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, stub: true, tool: "add_task" }, null, 2),
          },
        ],
      };
    },
  );
}