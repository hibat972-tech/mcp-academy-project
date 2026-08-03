import { readDataFile, writeDataFile } from "./dataFile.js";
import { todoListSchema, type TodoRecord } from "../schemas/todoRecord.js";

const TODOS_FILE = "todos.json";

async function loadTodoList(): Promise<TodoRecord[]> {
  let raw: string;
  try {
    raw = await readDataFile(TODOS_FILE);
  } catch (error) {
    // File not found (or unreadable) — start fresh per docs/data-plan.md
    console.error(`[todos] ${(error as Error).message} — starting with an empty list`);
    return [];
  }

  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    console.error("[todos] todos.json is empty — starting with an empty list");
    return [];
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(trimmed);
  } catch (error) {
    throw new Error(`todos.json is not valid JSON: ${(error as Error).message}`);
  }

  const result = todoListSchema.safeParse(parsedJson);
  if (!result.success) {
    throw new Error(`todos.json has invalid task records: ${result.error.message}`);
  }
  return result.data;
}

async function saveTodoList(tasks: TodoRecord[]): Promise<void> {
  await writeDataFile(TODOS_FILE, JSON.stringify(tasks, null, 2));
}

export async function addTask(
  title: string,
  priority: TodoRecord["priority"],
): Promise<TodoRecord> {
  const tasks = await loadTodoList();

  const nextId = String(
    tasks.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0) + 1,
  );

  const newTask: TodoRecord = {
    id: nextId,
    title,
    status: "open",
    priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await saveTodoList(tasks);
  return newTask;
}

export async function loadTodos(): Promise<TodoRecord[]> {
  return loadTodoList();
}

export function filterOpenTasks(tasks: TodoRecord[], limit?: number): TodoRecord[] {
  const openTasks = tasks.filter((task) => task.status === "open");
  if (typeof limit === "number") {
    return openTasks.slice(0, limit);
  }
  return openTasks;
}

export async function completeTaskById(id: string): Promise<TodoRecord> {
  const tasks = await loadTodoList();
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    throw new Error(`Task with id "${id}" was not found`);
  }

  task.status = "completed";
  await saveTodoList(tasks);
  return task;
}