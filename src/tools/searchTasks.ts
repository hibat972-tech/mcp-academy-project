import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";

const searchTasksInputSchema = z.object({
  query: z.string().min(1).max(200).describe("Keyword to search for in task titles"),
});

export function registerSearchTasks(server: McpServer) {
  server.registerTool(
    "search_tasks",
    {
      description: "Finds tasks matching a keyword in the title",
      inputSchema: searchTasksInputSchema,
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