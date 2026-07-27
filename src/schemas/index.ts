import * as z from "zod/v4";

// Tool 1: Search Notes Schema
export const searchNotesInputSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(200)
    .describe("Search text to look for across your notes"),
  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .optional()
    .describe("Max number of results to return, defaults to 10"),
});

// Tool 2: Create Task Schema
export const createTaskInputSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(150)
    .describe("Clear and concise title describing the task to be created"),
  priority: z
    .enum(["low", "medium", "high"])
    .describe("Task urgency level: low, medium, or high"),
  dueDate: z
    .string()
    .optional()
    .describe("Optional target completion date in ISO format (YYYY-MM-DD)"),
});

// Tool 3: Get Item Status Schema
export const getItemStatusInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe("The unique identifier (ID) of the item to retrieve status for"),
  includeHistory: z
    .boolean()
    .optional()
    .describe("Set to true to include full status change audit log history"),
});