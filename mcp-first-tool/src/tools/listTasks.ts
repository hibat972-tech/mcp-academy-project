import type { McpServer } from "@modelcontextprotocol/server";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { listTasksInputSchema } from "../../../src/schemas/listTask.ts";
import type { z } from "zod/v4";

type ListTasksInput = z.infer<typeof listTasksInputSchema>;

interface Task {
  id: string;
  title: string;
  status: "open" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

// Same root-relative pattern as the schema import above
const __dirname = dirname(fileURLToPath(import.meta.url));
const TODOS_PATH = resolve(__dirname, "../../../data/todos.json");

async function loadOpenTasks(): Promise<Task[]> {
  let raw: string;
  try {
    raw = await readFile(TODOS_PATH, "utf-8");
  } catch (err) {
    console.error(`[list_tasks] Could not read ${TODOS_PATH}:`, err);
    throw new Error("Task data file not found or unreadable.");
  }

  if (raw.trim() === "") {
    return []; // empty file → empty list, not an error
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`[list_tasks] Invalid JSON in ${TODOS_PATH}:`, err);
    throw new Error("Task data file contains invalid JSON.");
  }

  if (!Array.isArray(parsed)) {
    console.error(`[list_tasks] Expected an array, got ${typeof parsed}`);
    return [];
  }

  const tasks: Task[] = [];
  for (const [index, item] of parsed.entries()) {
    const row = item as Record<string, unknown>;
    const isValid =
      row &&
      typeof row === "object" &&
      typeof row.id === "string" &&
      typeof row.title === "string" &&
      (row.status === "open" || row.status === "completed") &&
      typeof row.createdAt === "string";

    if (isValid) {
      tasks.push(row as unknown as Task);
    } else {
      // bad row → skip + log, matches your data-plan.md failure mode
      console.error(`[list_tasks] Skipping malformed row at index ${index}:`, item);
    }
  }

  return tasks.filter((t) => t.status === "open");
}

export function registerListTasks(server: McpServer): void {
  server.registerTool(
    "list_tasks",
    {
      description: "List all open (pending) tasks",
      inputSchema: listTasksInputSchema,
    },
    async (input: ListTasksInput) => {
      let openTasks: Task[];
      try {
        openTasks = await loadOpenTasks();
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { ok: false, error: err instanceof Error ? err.message : "Unknown error" },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      const limited =
        typeof input.limit === "number" ? openTasks.slice(0, input.limit) : openTasks;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ tasks: limited, count: limited.length }, null, 2),
          },
        ],
      };
    }
  );
}