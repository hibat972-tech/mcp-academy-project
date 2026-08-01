import { z } from "zod";

export const tasks = z.object({
  id: z.string(),
  title: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  completed: z.boolean(),
});

export const tasksSchema = z.array(tasks);