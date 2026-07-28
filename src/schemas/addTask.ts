import * as z from "zod/v4";

export const addTaskInputSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200)
    .describe("The title or short description of the task to create"),
  priority: z
    .enum(["low", "medium", "high"])
    .describe("How urgent the task is: low, medium, or high"),
});