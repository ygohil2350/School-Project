import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // If authenticated, handle subdomain routing
  const host = request.headers.get("host");
  if (host) {
    const parts = host.split(".");
    if (parts.length > 2 && parts[parts.length - 2] !== "localhost") {
      const subdomain = parts[0];
      return NextResponse.rewrite(new URL(`/${subdomain}`, request.url));
    } else if (
      parts.length > 1 &&
      parts[0] !== "localhost" &&
      parts[0] !== "www"
    ) {
      const subdomain = parts[0];
      return NextResponse.rewrite(new URL(`/${subdomain}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
