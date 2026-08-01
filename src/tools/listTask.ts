import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { listTasksInputSchema } from "../schemas/listTask.js";

/** Week 2 stub — list tasks (P0 candidate). */
export function registerListTaskTool(server: McpServer): void {
  server.registerTool(
    "list_tasks",
    {
      description:
        "List all open tasks, optionally limiting the number of returned tasks.",
      inputSchema: listTasksInputSchema,
    },
    async ({ limit }) => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                stub: true,
                tool: "list_tasks",
                limit,
                message:
                  "Replace this stub in Week 3 with real task listing.",
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