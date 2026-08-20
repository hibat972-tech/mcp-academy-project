import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchTasksInputSchema } from "../schemas/searchTask.js";
import { searchTasks } from "../lib/tasks.js";

export function registerSearchTasksTool(
  server: McpServer,
): void {
  server.registerTool(
    "search_tasks",
    {
      description:
        "Searches tasks using flexible keyword matching. By default, only incomplete tasks are returned.",
      inputSchema: searchTasksInputSchema,
    },
    async ({ query, status }) => {
      try {
        const tasks = await searchTasks(query, status);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  ok: true,
                  count: tasks.length,
                  tasks,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        console.error(
          `search_tasks failed: ${(error as Error).message}`,
        );

        return {
          content: [
            {
              type: "text",
              text: `Could not search tasks: ${
                (error as Error).message
              }`,
            },
          ],
        };
      }
    },
  );
}