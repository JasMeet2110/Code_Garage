import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  if (!token) {
    if (pathname.startsWith("/Admin")) {
      return NextResponse.redirect(new URL("/AuthScreen", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/Admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/Client/account", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Admin/:path*",
  ],
};
