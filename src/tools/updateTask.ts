import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { updateTaskInputSchema } from "../schemas/updateTask.js";
import { updateTaskById } from "../lib/tasks.js";

export function registerUpdateTaskTool(server: McpServer): void {
  server.registerTool(
    "update_task",
    {
      description:
        "Update one or more fields of an existing task by its ID. Only the provided fields are changed.",
      inputSchema: updateTaskInputSchema,
    },
    async ({ id, title, priority, deadline }) => {
      try {
        const task = await updateTaskById(id, {
          title,
          priority,
          deadline,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, task }, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`update_task failed: ${(error as Error).message}`);

        return {
          content: [
            {
              type: "text",
              text: `Could not update task: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );
}