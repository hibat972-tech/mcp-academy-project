import { readDataFile, writeDataFile } from "./dataFile.ts";
import { todoListSchema, type TodoRecord } from "../schemas/todoRecord.ts";

const TODOS_FILE = "todos.json";

// Loads and validates the full todo list from data/todos.json
export async function loadTodos(): Promise<TodoRecord[]> {
  const raw = await readDataFile(TODOS_FILE);
  const parsed = JSON.parse(raw);
  return todoListSchema.parse(parsed);
}

// Marks a task as completed by ID. Throws if the ID doesn't exist.
export async function completeTaskById(id: string): Promise<TodoRecord> {
  const todos = await loadTodos();
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`No task found with id "${id}"`);
  }

  todos[index] = { ...todos[index], status: "completed" };
  await writeDataFile(TODOS_FILE, JSON.stringify(todos, null, 2));

  return todos[index];
}