import type { McpServer } from "@modelcontextprotocol/server";

import { addTaskInputSchema } from "../schemas/addTask.js";

/** Week 2 stub — add a new task (P0 candidate). */
export function registerAddTaskTool(server: McpServer): void {
  server.registerTool(
    "add_task",
    {
      description:
        "Create a new task with a title and priority for later tracking.",
      inputSchema: addTaskInputSchema,
    },
    async ({ title, priority }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "add_task",
                title,
                priority,
                message:
                  "Replace this stub in Week 3 with real task storage.",
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