import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_COOKIE, ROLE_HOME, TOKEN_COOKIE } from "@/lib/constants";
import type { Role } from "@/types";

const ROUTE_ROLE_MAP: { prefix: string; allowed: Role[] }[] = [
  {
    prefix: "/admin",
    allowed: ["ADMIN", "SUPER_ADMIN", "OPS_MANAGER", "HUB_MANAGER"],
  },
  { prefix: "/dashboard", allowed: ["CUSTOMER"] },
  { prefix: "/provider", allowed: ["COURIER"] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matched = ROUTE_ROLE_MAP.find((r) => pathname.startsWith(r.prefix));
  if (!matched) return NextResponse.next();

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value as Role | undefined;

  if (!token || !role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!matched.allowed.includes(role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/provider/:path*"],
};
