import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listTasksInputSchema } from "../schemas/index.ts";

export function registerListTasks(server: McpServer) {
  server.registerTool(
    "list_tasks",
    {
      description: "Returns all open (pending) tasks",
      inputSchema: listTasksInputSchema,
    },
    async (input) => {
      // Week 2: stub only — Week 3 replaces this with real data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ ok: true, stub: true, tool: "list_tasks" }, null, 2),
          },
        ],
      };
    },
  );
}