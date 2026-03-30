/**
 * Simple file-based task store for the Tactics Board.
 * Each user's tasks are saved in data/tactics.json as { [username]: Task[] }.
 *
 * NOTE: File writes don't persist on serverless platforms like Vercel.
 * For production, swap readStore / writeStore to use a real database.
 */

import fs from "fs";
import path from "path";

export interface Task {
  id: string;
  text: string;
  quadrant: 1 | 2 | 3 | 4; // 1=Do Now, 2=Schedule, 3=Delegate, 4=Drop
  createdAt: string;
}

type Store = Record<string, Task[]>;

const STORE_PATH = path.join(process.cwd(), "data", "tactics.json");

function readStore(): Store {
  try {
    if (!fs.existsSync(STORE_PATH)) return {};
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as Store;
  } catch {
    return {};
  }
}

function writeStore(store: Store): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function getTasksForUser(username: string): Task[] {
  const store = readStore();
  return store[username] ?? [];
}

export function createTask(username: string, text: string, quadrant: Task["quadrant"]): Task {
  const store = readStore();
  const task: Task = {
    id: crypto.randomUUID(),
    text,
    quadrant,
    createdAt: new Date().toISOString(),
  };
  store[username] = [...(store[username] ?? []), task];
  writeStore(store);
  return task;
}

export function updateTask(
  username: string,
  id: string,
  patch: Partial<Pick<Task, "text" | "quadrant">>
): Task | null {
  const store = readStore();
  const tasks = store[username] ?? [];
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...patch };
  store[username] = tasks;
  writeStore(store);
  return tasks[idx];
}

export function deleteTask(username: string, id: string): boolean {
  const store = readStore();
  const before = (store[username] ?? []).length;
  store[username] = (store[username] ?? []).filter((t) => t.id !== id);
  if (store[username].length === before) return false;
  writeStore(store);
  return true;
}

