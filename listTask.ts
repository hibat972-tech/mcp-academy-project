import * as z from "zod/v4";

// Tool: list_task — returns all tasks
export const listTaskInputSchema = z
  .object({})
  .describe("No input is required to list all tasks.");