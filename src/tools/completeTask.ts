import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { completeTaskInputSchema } from "../schemas/index.ts";
import { completeTaskById } from "../lib/todos.ts";

export function registerCompleteTaskTool(server: McpServer)  {
  server.registerTool(
    "complete_task",
    {
      description: "Marks an existing task as done by its ID",
      inputSchema: completeTaskInputSchema,
    },
    async (input) => {
      try {
        const task = await completeTaskById(input.id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { ok: true, task },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        console.error(`complete_task failed: ${(error as Error).message}`);
        return {
          content: [
            {
              type: "text",
              text: `Could not complete task: ${(error as Error).message}`,
            },
          ],
        };
      }
    },
  );
}