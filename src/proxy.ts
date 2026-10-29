import { NextRequest, NextResponse } from "next/server";
import { decodeSession } from "@/lib/session-codec";
export function proxy(request: NextRequest) {
  const session = decodeSession(request.cookies.get("rewallet_session")?.value);
  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set(
      "returnTo",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);
  }
  if (!session.hasPin && !request.nextUrl.pathname.startsWith("/onboarding/"))
    return NextResponse.redirect(new URL("/onboarding/pin", request.url));
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transfer/:path*",
    "/top-up/:path*",
    "/activity/:path*",
    "/profile/:path*",
    "/transactions/:path*",
    "/onboarding/:path*",
  ],
};
