import * as z from "zod/v4";

// Tool: delete_task — deletes an existing task by its ID

export const deleteTaskInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(100)
    .describe("The unique ID of the task to delete"),
});