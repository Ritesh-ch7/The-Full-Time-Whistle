import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createPageForUser,
  deletePageForUser,
  getWorkspaceForUser,
  savePageForUser,
  setActivePageForUser,
} from "@/lib/dugout-store";
import type { Block } from "@/lib/dugout-store";

/** GET /api/dugout — return the current user's Dugout workspace */
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const workspace = getWorkspaceForUser(session.username);
  return NextResponse.json(workspace);
}

/** POST /api/dugout — create a new page */
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title : "Untitled page";
  const page = createPageForUser(session.username, title);

  return NextResponse.json({ page });
}

/** PATCH /api/dugout — set active page */
export async function PATCH(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const activePageId = body?.activePageId;

  if (typeof activePageId !== "string" || activePageId.length === 0) {
    return NextResponse.json({ error: "Invalid payload: activePageId is required" }, { status: 400 });
  }

  const workspace = setActivePageForUser(session.username, activePageId);
  return NextResponse.json(workspace);
}

/** PUT /api/dugout — save/replace one page */
export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  const pageId: string | undefined = body?.pageId;
  const title: string | undefined = body?.title;
  const blocks: Block[] = body?.blocks;

  if (typeof pageId !== "string" || pageId.length === 0) {
    return NextResponse.json({ error: "Invalid payload: pageId is required" }, { status: 400 });
  }

  if (!Array.isArray(blocks)) {
    return NextResponse.json({ error: "Invalid payload: blocks must be an array" }, { status: 400 });
  }

  const page = savePageForUser(session.username, pageId, blocks, title);
  return NextResponse.json({ page });
}

/** DELETE /api/dugout — delete one page */
export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const pageId = body?.pageId;

  if (typeof pageId !== "string" || pageId.length === 0) {
    return NextResponse.json({ error: "Invalid payload: pageId is required" }, { status: 400 });
  }

  const workspace = deletePageForUser(session.username, pageId);
  if (!workspace) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(workspace);
}

