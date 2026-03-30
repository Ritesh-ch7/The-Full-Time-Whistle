import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the auth pages through (no session required)
  if (
    pathname.startsWith("/gaffers-room/login") ||
    pathname.startsWith("/gaffers-room/register")
  ) {
    return NextResponse.next();
  }

  // Protect all /gaffers-room routes
  if (pathname.startsWith("/gaffers-room")) {
    const session = await getSession(request);
    if (!session) {
      const loginUrl = new URL("/gaffers-room/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/gaffers-room/:path*"],
};

