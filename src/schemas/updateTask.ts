import * as z from "zod/v4";

// Tool: update_task — updates only the provided fields of an existing task

export const updateTaskInputSchema = z.object({
  id: z
    .number()
    .int()
    .positive()
    .min(1)
    .max(100)
    .describe("The unique ID of the task to update"),

  title: z
    .string()
    .min(1)
    .max(200)
    .optional()
    .describe("The new title or description of the task"),

  priority: z
    .enum(["low", "medium", "high"])
    .optional()
    .describe("The new priority of the task"),

  deadline: z
    .iso.date()
    .optional()
    .describe("The new deadline date like 2026-02-22"),
});