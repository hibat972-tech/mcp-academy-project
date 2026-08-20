import * as z from "zod/v4";

// Tool: search_tasks — searches existing tasks using a flexible query

export const searchTasksInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(200)
    .describe(
      "The text or keywords to search for in task titles and descriptions",
    ),

  status: z
    .enum(["open", "completed", "all"])
    .default("open")
    .describe(
      "Which tasks to search: open tasks by default, completed tasks, or all tasks",
    ),
});
