import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { addTaskInputSchema } from "../schemas/addTask.js";
import { addTask } from "../lib/tasks.js";



export function registerAddTaskTool(server: McpServer): void {
  server.registerTool(
    "add_task",
    {
      description:
        "Create a new task with a title, priority, and deadline, saved to data/todos.json.",
      inputSchema: addTaskInputSchema,
    },
    async ({ title, priority, deadline }) => {
      try {
        const task = await addTask(title, priority, deadline);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ ok: true, task }, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error(`add_task failed: ${(error as Error).message}`);

        return {
          content: [
            {
              type: "text",
              text: `Could not add task: ${(error as Error).message}`,
            },
          ],
        };
      }
    }
  );
}