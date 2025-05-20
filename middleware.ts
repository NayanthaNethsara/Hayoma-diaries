import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    // For demo purposes, we're bypassing authentication
    // In a real app, you would check for authentication here
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // If there's an error, still allow the request to proceed
    // This prevents blocking the UI due to auth errors
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/learn/:path*",
    "/login",
    "/register",
    "/about",
    "/((?!api|_next|favicon.ico|.*\\.(?:jpg|jpeg|png|svg|webp|gif|ico|woff|woff2|ttf|eot)).*)",
  ],
};
