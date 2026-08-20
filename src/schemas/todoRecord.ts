import * as z from "zod/v4";

// Shape of a single task record as stored in data/todos.json
export const todoRecordSchema = z.object({
  id: z
    .number()
    .int()
    .positive()
    .describe("Unique numeric identifier for the task"),

  title: z
    .string()
    .min(1)
    .describe("The task's title"),

  status: z
    .enum(["open", "completed"])
    .describe("Whether the task is open or completed"),

  priority: z
    .enum(["low", "medium", "high"])
    .describe("Task priority"),

  deadline: z
    .iso
    .date()
    .describe(
      "The deadline date for completing the task, like 2026-02-22",
    ),
});

export const todoListSchema = z.array(todoRecordSchema);

export type TodoRecord = z.infer<typeof todoRecordSchema>;