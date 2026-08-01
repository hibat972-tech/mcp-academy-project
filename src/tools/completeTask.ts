import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { completeTaskInputSchema } from "../schemas/completeTask.js";

/** Week 2 stub — mark a task as completed (P0 candidate). */
export function registerCompleteTaskTool(server: McpServer): void {
  server.registerTool(
    "complete_task",
    {
      description:
        "Mark an existing task as completed using its unique ID.",
      inputSchema: completeTaskInputSchema,
    },
    async ({ id }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "complete_task",
                id,
                message:
                  "Replace this stub in Week 3 with real task completion.",
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