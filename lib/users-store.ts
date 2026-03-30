/**
 * Simple file-based user store.
 * Users are persisted in data/users.json as an array of User objects.
 *
 * NOTE: file writes don't survive on serverless platforms (e.g. Vercel).
 * Swap readStore / writeStore for a real DB adapter when deploying there.
 */

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

const STORE_PATH = path.join(process.cwd(), "data", "users.json");
const SALT_ROUNDS = 12;

function readStore(): User[] {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as User[];
  } catch {
    return [];
  }
}

function writeStore(users: User[]): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(users, null, 2), "utf-8");
}

/** Find a user by username (case-insensitive). */
export function findByUsername(username: string): User | null {
  const users = readStore();
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? null;
}

/** Create a new user. Returns null if the username is already taken. */
export async function createUser(username: string, plainPassword: string): Promise<User | null> {
  const users = readStore();
  const exists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
  if (exists) return null;

  const passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  const user: User = {
    id: crypto.randomUUID(),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  writeStore([...users, user]);
  return user;
}

/** Verify a plain password against a stored hash. */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

