import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/login", "/register", "/about"];
  const isPublicPath = publicPaths.includes(pathname);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isTokenExpired = token?.exp
    ? Date.now() >= Number(token.exp) * 1000
    : true;

  const userRole = token?.role;

  if (!isPublicPath && (!token || isTokenExpired)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated and trying to access login or register
  if (isPublicPath && token && !isTokenExpired) {
    let redirectPath = "/dashboard";

    if (userRole === "ADMIN") {
      redirectPath = "/dashboard/admin";
    } else if (userRole === "DRIVER") {
      redirectPath = "/dashboard/driver";
    } else if (userRole === "SHOP") {
      redirectPath = "/dashboard/shop";
    }

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
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
