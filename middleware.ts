import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Check for admin paths
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      // If it's /admin/login, allow it even without admin role
      if (pathname === "/admin/login") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // If it's /admin/login, allow everyone
        if (pathname === "/admin/login") {
          return true;
        }

        // If it's a protected path, require a token
        const protectedPaths = ["/account", "/checkout", "/admin"];
        if (protectedPaths.some(path => pathname.startsWith(path))) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
