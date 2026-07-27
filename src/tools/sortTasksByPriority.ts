import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";

const sortTasksByPriorityInputSchema = z.object({});

export function registerSortTasksByPriority(server: McpServer) {
  server.registerTool(
    "sort_tasks_by_priority",
    {
      description: "Returns all tasks ordered from high to low priority",
      inputSchema: sortTasksByPriorityInputSchema,
    },
    async (input) => {
      // Week 2: stub only — not implemented yet (P1)
      return {
        content: [
          {
            type: "text",
            text: "not implemented yet",
          },
        ],
      };
    },
  );
}