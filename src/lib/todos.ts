import { readDataFile, writeDataFile } from "./dataFile.js";
import { todoListSchema, type TodoRecord } from "../schemas/todoRecord.js";

const TODOS_FILE = "todos.json";

// Loads and validates the full todo list from data/todos.json
export async function loadTodos(): Promise<TodoRecord[]> {
  const raw = await readDataFile(TODOS_FILE);
  const parsed = JSON.parse(raw);
  return todoListSchema.parse(parsed);
}

// Marks a task as completed by ID. Throws if the ID doesn't exist.
export async function completeTaskById(id: number): Promise<TodoRecord> {
  const todos = await loadTodos();
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`No task found with id "${id}"`);
  }

  todos[index] = { ...todos[index], status: "completed" };
  await writeDataFile(TODOS_FILE, JSON.stringify(todos, null, 2));

  return todos[index];
}

// Deletes a task by ID. Throws if the ID doesn't exist.
export async function deleteTaskById(id: number): Promise<TodoRecord> {
  const todos = await loadTodos();
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`No task found with id "${id}"`);
  }

  const [deletedTask] = todos.splice(index, 1);

  await writeDataFile(TODOS_FILE, JSON.stringify(todos, null, 2));

  return deletedTask;
}

export async function updateTaskById(
  id: number,
  updates: {
    title?: string;
    priority?: TodoRecord["priority"];
    deadline?: string;
  },
): Promise<TodoRecord> {
  const todos = await loadTodos();
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error(`No task found with id "${id}"`);
  }

  const task = todos[index];

  if (updates.title !== undefined) {
    task.title = updates.title;
  }

  if (updates.priority !== undefined) {
    task.priority = updates.priority;
  }

  if (updates.deadline !== undefined) {
    task.deadline = updates.deadline;
  }

  await writeDataFile(TODOS_FILE, JSON.stringify(todos, null, 2));

  return task;
}

type SearchTaskStatus = "open" | "completed" | "all";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/^ال/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function taskMatchesQuery(task: TodoRecord, query: string): boolean {
  const normalizedQuery = normalizeText(query);
  const normalizedTitle = normalizeText(task.title);

  if (normalizedTitle.includes(normalizedQuery)) {
    return true;
  }

  const queryWords = normalizedQuery.split(" ");
  const titleWords = normalizedTitle.split(" ");

  return queryWords.every((queryWord) =>
    titleWords.some(
      (titleWord) =>
        titleWord.includes(queryWord) ||
        queryWord.includes(titleWord),
    ),
  );
}

export async function searchTasks(
  query: string,
  status: SearchTaskStatus = "open",
): Promise<TodoRecord[]> {
  const todos = await loadTodos();

  return todos.filter((task) => {
    if (status !== "all" && task.status !== status) {
      return false;
    }

    return taskMatchesQuery(task, query);
  });
}