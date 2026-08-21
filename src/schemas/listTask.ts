import * as z from "zod/v4";

// Tool: list_tasks — returns open tasks sorted by deadline and priority
export const listTasksInputSchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .describe("Max number of tasks to return, defaults to all open tasks"),

  deadline: z
    .iso.date()
    .optional()
    .describe("Optional cutoff date. Only tasks due on or before this date are returned"),
});