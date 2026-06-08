import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;
  const isAuth = !!token;
  const { pathname } = req.nextUrl;
  const protectedRoutes = ["/checkout", "/conta", "/favoritos", "/admin"];
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isAuth) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/conta/:path*", "/favoritos/:path*", "/admin/:path*"],
};
