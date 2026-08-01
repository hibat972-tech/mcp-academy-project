import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { completeTaskInputSchema } from "../schemas/index.ts";

export function registerCompleteTask(server: McpServer) {
  server.registerTool(
    "complete_task",
    {
      description: "Marks an existing task as done by its ID",
      inputSchema: completeTaskInputSchema,
    },
    async (input) => {
      // Week 2: stub only — Week 3 replaces this with real data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, stub: true, tool: "complete_task" }, null, 2),
          },
        ],
      };
    },
  );
}