import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateTask, deleteTask } from "@/lib/tactics-store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const patch: { text?: string; quadrant?: 1 | 2 | 3 | 4 } = {};

  if (typeof body.text === "string") patch.text = body.text;
  if ([1, 2, 3, 4].includes(body.quadrant)) patch.quadrant = body.quadrant;

  const updated = updateTask(session.username, id, patch);
  if (!updated) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const deleted = deleteTask(session.username, id);
  if (!deleted) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

