import { NextResponse, type NextRequest } from "next/server";
import { sharedRateLimiter } from "@atl/core";

// Caveman rate limiting per client IP, before anything touches the database. It stops someone
// hammering the site from one address; it does not stop a real flood.
const MINUTE = 60_000;
// Link prefetches count here too: Next strips the router headers before proxy runs, so they look
// like page loads. Fast browsing measured ~10 requests per page view, so 120 leaves headroom.
const pages = sharedRateLimiter("ip:pages", { limit: 120, windowMs: MINUTE });
// Server actions (POST) and the GitHub login, which writes a session on every round trip.
const writes = sharedRateLimiter("ip:writes", { limit: 20, windowMs: MINUTE });

export function proxy(request: NextRequest) {
  const { ok, retryAfterSeconds } = (isWrite(request) ? writes : pages).hit(clientIp(request));
  if (ok) return NextResponse.next();

  return new NextResponse(
    "429 Too Many Requests. Run away! Run away! Come back in a minute, and a bit slower this time.\n",
    {
      status: 429,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": String(retryAfterSeconds) },
    },
  );
}

function isWrite(request: NextRequest): boolean {
  return (
    (request.method !== "GET" && request.method !== "HEAD") ||
    request.nextUrl.pathname.startsWith("/auth/github")
  );
}

/**
 * kamal-proxy appends the address it sees to `X-Forwarded-For`; everything to the left of it came
 * from the client and can be forged, so only the last entry counts.
 */
function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "unknown";
}

export const config = {
  // Not static assets, and not /up: kamal-proxy polls it during every deploy.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|up$).*)"],
};
