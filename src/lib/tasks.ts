import { readDataFile, writeDataFile } from "./dataFile.js";
import { todoListSchema, type TodoRecord } from "../schemas/todoRecord.js";

const TODOS_FILE = "todos.json";

async function loadTodoList(): Promise<TodoRecord[]> {
  let raw: string;

  try {
    raw = await readDataFile(TODOS_FILE);
  } catch (error) {
    console.error(
      `[todos] ${(error as Error).message} — starting with an empty list`,
    );
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
    throw new Error(
      `todos.json is not valid JSON: ${(error as Error).message}`,
    );
  }

  const result = todoListSchema.safeParse(parsedJson);

  if (!result.success) {
    throw new Error(
      `todos.json has invalid task records: ${result.error.message}`,
    );
  }

  return result.data;
}

async function saveTodoList(tasks: TodoRecord[]): Promise<void> {
  await writeDataFile(TODOS_FILE, JSON.stringify(tasks, null, 2));
}

export async function addTask(
  title: string,
  priority: TodoRecord["priority"],
  deadline: string,
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
    deadline,
  };

  tasks.push(newTask);
  await saveTodoList(tasks);

  return newTask;
}

export async function loadTodos(): Promise<TodoRecord[]> {
  return loadTodoList();
}

export function filterOpenTasks(
  tasks: TodoRecord[],
  limit?: number,
): TodoRecord[] {
  const openTasks = tasks.filter((task) => task.status === "open");

  if (typeof limit === "number") {
    return openTasks.slice(0, limit);
  }

  return openTasks;
}

export function filterAndSortOpenTasks(
  tasks: TodoRecord[],
  deadline?: string,
): TodoRecord[] {
  let openTasks = tasks.filter((task) => task.status === "open");

  if (deadline) {
    openTasks = openTasks.filter(
      (task) => task.deadline <= deadline,
    );
  }

  const priorityOrder: Record<TodoRecord["priority"], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return openTasks.sort((a, b) => {
    const deadlineComparison = a.deadline.localeCompare(b.deadline);

    if (deadlineComparison !== 0) {
      return deadlineComparison;
    }

    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
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

export async function deleteTaskById(id: string): Promise<TodoRecord> {
  const tasks = await loadTodoList();
  const taskIndex = tasks.findIndex((item) => item.id === id);

  if (taskIndex === -1) {
    throw new Error(`Task with id "${id}" was not found`);
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);

  await saveTodoList(tasks);

  return deletedTask;
}

export async function updateTaskById(
  id: string,
  updates: {
    title?: string;
    priority?: TodoRecord["priority"];
    deadline?: string;
  },
): Promise<TodoRecord> {
  const tasks = await loadTodoList();
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    throw new Error(`Task with id "${id}" was not found`);
  }

  if (updates.title !== undefined) {
    task.title = updates.title;
  }

  if (updates.priority !== undefined) {
    task.priority = updates.priority;
  }

  if (updates.deadline !== undefined) {
    task.deadline = updates.deadline;
  }

  await saveTodoList(tasks);

  return task;
}