import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./app/lib/auth/auth";


verifyJWT
const publicRoutes = ["/", "/login", "/signup", "/verify"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("Token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verifyJWT(token);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT Verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/profile/:path*",   
    "/community/:path*",       
  ],
};
