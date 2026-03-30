import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users-store";
import { signToken, SESSION_COOKIE } from "@/lib/auth";

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,20}$/;

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // ── Validate inputs ──────────────────────────────────────────────────────
  if (!username || !USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3–20 characters: letters, numbers, _ or -" },
      { status: 400 }
    );
  }

  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  // ── Create user ──────────────────────────────────────────────────────────
  const user = await createUser(username, password);
  if (!user) {
    return NextResponse.json(
      { error: "That username is already taken." },
      { status: 409 }
    );
  }

  // ── Issue session cookie ─────────────────────────────────────────────────
  const token = await signToken({ username: user.username });
  const res = NextResponse.json({ ok: true }, { status: 201 });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}

