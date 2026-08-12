import * as z from "zod/v4";

// Tool: add_task — creates a new task with a title, priority, and deadline
export const addTaskInputSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200)
    .describe("The title or short description of the task to create"),

  priority: z
    .enum(["low", "medium", "high"])
    .describe("How urgent the task is: low, medium, or high"),

  deadline: z
    .iso.date()
    .describe("The deadline date for completing the task like 2026-02-22"),
});