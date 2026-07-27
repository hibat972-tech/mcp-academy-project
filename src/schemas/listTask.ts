import * as z from "zod/v4";



// Tool: list_tasks — returns all open (pending) tasks
export const listTasksInputSchema = z.object({
  limit: z
    .number()
    .int()
    .positive()
    .max(50)
    .optional()
    .describe("Max number of tasks to return, defaults to all open tasks"),
});

