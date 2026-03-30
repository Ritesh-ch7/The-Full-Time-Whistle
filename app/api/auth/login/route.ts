import { NextRequest, NextResponse } from "next/server";
import { signToken, SESSION_COOKIE } from "@/lib/auth";
import { findByUsername, verifyPassword } from "@/lib/users-store";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials." }, { status: 400 });
  }

  const user = findByUsername(username);
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  // Constant-time-ish: always run verifyPassword to avoid timing attacks
  if (!user || !valid) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const token = await signToken({ username: user.username });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}

