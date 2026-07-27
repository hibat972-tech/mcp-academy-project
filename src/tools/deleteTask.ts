import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";

const deleteTaskInputSchema = z.object({
  id: z.string().min(1).describe("The unique ID of the task to delete"),
});

export function registerDeleteTask(server: McpServer) {
  server.registerTool(
    "delete_task",
    {
      description: "Removes a task permanently by ID",
      inputSchema: deleteTaskInputSchema,
    },
    async (input) => {
      // Week 2: stub only — not implemented yet (P1)
      return {
        content: [
          {
            type: "text",
            text: "not implemented yet",
          },
        ],
      };
    },
  );
}