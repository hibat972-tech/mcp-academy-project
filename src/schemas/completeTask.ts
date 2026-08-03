import * as z from "zod/v4";

// Tool: complete_task — marks an existing task as done by its ID
export const completeTaskInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(100)
    .describe("The unique ID of the task to mark as completed"),
});