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

// Ships a rate-limit-exceeded event to the shared Mission Control feed
// (ai.portofcams.com/api/dashboard/errors) so a brute-force burst actually
// shows up somewhere monitored instead of only console. Fire-and-forget,
// production-only, silently no-ops if CAPT_J_DASHBOARD_KEY isn't set.
// Mirrors binnacle-ai's src/lib/log.ts.
// Added 2026-07-13 — see memory: security_detection_coverage_audit_2026_07_13.md
function shipRateLimitEvent(key: string): void {
  if (process.env.NODE_ENV !== "production") return;
  const dashboardKey =
    process.env.CAPT_J_DASHBOARD_KEY ?? process.env.DASHBOARD_API_KEY;
  if (!dashboardKey) return;
  const endpoint =
    process.env.DASHBOARD_ERROR_ENDPOINT ??
    "https://ai.portofcams.com/api/dashboard/errors";
  const message = `[auth] rate-limited ${key}`;
  let h = 5381;
  for (let i = 0; i < message.length; i++) {
    h = ((h << 5) + h + message.charCodeAt(i)) >>> 0;
  }
  const fingerprint = `cc-${h.toString(16).padStart(8, "0")}`;
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": dashboardKey },
    body: JSON.stringify({
      projectId: "contractorcalc",
      env: "production",
      level: "error",
      message,
      fingerprint,
    }),
  }).catch(() => {
    // Swallow — never let error-capture break the actual rate limiter.
  });
}

interface KeyedEntry {
  count: number;
  resetAt: number;
}

const keyedStore = new Map<string, KeyedEntry>();

/**
 * Simple keyed in-memory rate limiter — for call sites (like NextAuth's
 * authorize()) that don't have a raw Request to hand the interval-based
 * `rateLimit()` factory below. Login previously had NO rate-limiting at
 * all; added 2026-07-13 alongside the Mission Control wiring.
 * @param key       Unique identifier, e.g. `login:${ip}:${email}`
 * @param limit     Max attempts per window (default 5)
 * @param windowMs  Window duration in ms (default 15 minutes)
 */
export function rateLimitByKey(
  key: string,
  limit: number = 5,
  windowMs: number = 15 * 60_000
): { success: boolean; remaining: number } {
  const now = Date.now();
  if (keyedStore.size > 1000) {
    for (const [k, entry] of keyedStore) {
      if (now > entry.resetAt) keyedStore.delete(k);
    }
  }

  const entry = keyedStore.get(key);
  if (!entry || now > entry.resetAt) {
    keyedStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  entry.count++;
  if (entry.count > limit) {
    shipRateLimitEvent(key);
    return { success: false, remaining: 0 };
  }
  return { success: true, remaining: limit - entry.count };
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
