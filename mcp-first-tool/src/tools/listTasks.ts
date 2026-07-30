import type { McpServer } from "@modelcontextprotocol/server";
import { listTasksInputSchema } from "../../../src/schemas/listTask.ts";
import type { z } from "zod/v4";

type ListTasksInput = z.infer<typeof listTasksInputSchema>;

export function registerListTasks(server: McpServer): void {
  server.registerTool(
    "list_tasks",
    {
      description: "List all open (pending) tasks",
      inputSchema: listTasksInputSchema,
    },
    async (input: ListTasksInput) => {
      // input.limit is number | undefined here — fully typed, no 'any'
      // Week 2: stub only — Week 3 replaces this with real data
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { ok: true, stub: true, tool: "list_tasks", receivedLimit: input.limit ?? null },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}