import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listTasksInputSchema } from "../schemas/listTask.js";
import type { z } from "zod/v4";
import {
  loadTodos,
  filterAndSortOpenTasks,
} from "../lib/tasks.js";

type ListTasksInput = z.infer<typeof listTasksInputSchema>;

export function registerListTasks(server: McpServer): void {
  server.registerTool(
    "list_tasks",
    {
      description:
        "List open tasks sorted by deadline and priority, with an optional deadline filter and limit.",
      inputSchema: listTasksInputSchema,
    },
    async (input: ListTasksInput) => {
      let tasks;

      try {
        tasks = await loadTodos();
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  ok: false,
                  error:
                    err instanceof Error ? err.message : "Unknown error",
                },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }

      const filteredAndSorted = filterAndSortOpenTasks(
        tasks,
        input.deadline,
      );

      const limited = input.limit
        ? filteredAndSorted.slice(0, input.limit)
        : filteredAndSorted;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                tasks: limited,
                count: limited.length,
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}