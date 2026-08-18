import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { deleteTaskInputSchema } from "../schemas/index.js";
import { deleteTaskById } from "../lib/tasks.js";

export function registerDeleteTaskTool(server: McpServer) {
  server.registerTool(
    "delete_task",
    {
      description: "Deletes an existing task by its ID",
      inputSchema: deleteTaskInputSchema,
    },
    async (input) => {
      try {
        const task = await deleteTaskById(input.id);

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
        console.error(
          `delete_task failed: ${(error as Error).message}`,
        );

        return {
          content: [
            {
              type: "text",
              text: `Could not delete task: ${(error as Error).message}`,
            },
          ],
        };
      }
    },
  );
}