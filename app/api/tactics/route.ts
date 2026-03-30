import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTasksForUser, createTask } from "@/lib/tactics-store";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const tasks = getTasksForUser(session.username);
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { text, quadrant } = await req.json();
  if (!text || ![1, 2, 3, 4].includes(quadrant)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const task = createTask(session.username, text, quadrant);
  return NextResponse.json(task, { status: 201 });
}

