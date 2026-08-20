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
        "Retrieves the user's existing open tasks from data/todos.json, sorted by deadline and priority. Use this tool before generating a study plan. When the user asks for a study plan, first determine the requested date range, then retrieve the relevant open tasks. Do not invent tasks or use unrelated tasks from the conversation when the user's existing tasks are available through this tool. Do not assume, guess, or invent how many hours a task requires. If the remaining study hours or useful study session length are needed and not known, ask the student for them before generating the plan. Tasks whose deadlines fall within the requested period must be considered first regardless of whether their priority is high, medium, or low. After the current period's obligations have been scheduled, remaining study capacity may be used for future open tasks, prioritizing them by priority, deadline urgency, remaining workload, and difficulty. Completed tasks must not be included in the study plan.",
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

      const limited =
        input.limit !== undefined
          ? filteredAndSorted.slice(0, input.limit)
          : filteredAndSorted;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ok: true,
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