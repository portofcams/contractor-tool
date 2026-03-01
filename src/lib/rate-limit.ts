/**
 * In-memory rate limiter for API routes.
 *
 * Uses a sliding window counter per IP address.
 * Entries are auto-cleaned every 5 minutes to prevent memory leaks.
 *
 * Usage:
 *   const limiter = rateLimit({ interval: 60_000, limit: 20 });
 *
 *   export async function POST(req: Request) {
 *     const res = limiter.check(req);
 *     if (res) return res; // 429 response
 *     ...
 *   }
 */

import { NextResponse } from "next/server";

interface RateLimitOptions {
  /** Time window in milliseconds */
  interval: number;
  /** Max requests per window */
  limit: number;
}

interface Entry {
  count: number;
  resetAt: number;
}

export function rateLimit({ interval, limit }: RateLimitOptions) {
  const store = new Map<string, Entry>();

  // Cleanup stale entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();

  return {
    check(req: Request): NextResponse | null {
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded?.split(",")[0]?.trim() || "unknown";
      const now = Date.now();

      const entry = store.get(ip);

      if (!entry || now > entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + interval });
        return null;
      }

      entry.count++;

      if (entry.count > limit) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: { "Retry-After": String(retryAfter) },
          }
        );
      }

      return null;
    },
  };
}
