import * as z from "zod/v4";

// Tool: add_task — creates a new task with a title and priority
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

// Tool: complete_task — marks an existing task as done by its ID
export const completeTaskInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe("The unique ID of the task to mark as completed"),
});