import { describe, it, expect } from "vitest";
import { rateLimit } from "./rate-limit";

function mockRequest(ip: string = "127.0.0.1"): Request {
  return new Request("http://localhost/test", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("rateLimit", () => {
  it("allows requests under the limit", () => {
    const limiter = rateLimit({ interval: 60_000, limit: 3 });
    expect(limiter.check(mockRequest())).toBeNull();
    expect(limiter.check(mockRequest())).toBeNull();
    expect(limiter.check(mockRequest())).toBeNull();
  });

  it("blocks requests over the limit", () => {
    const limiter = rateLimit({ interval: 60_000, limit: 2 });
    expect(limiter.check(mockRequest())).toBeNull();
    expect(limiter.check(mockRequest())).toBeNull();
    const blocked = limiter.check(mockRequest());
    expect(blocked).not.toBeNull();
    expect(blocked!.status).toBe(429);
  });

  it("tracks different IPs separately", () => {
    const limiter = rateLimit({ interval: 60_000, limit: 1 });
    expect(limiter.check(mockRequest("1.1.1.1"))).toBeNull();
    expect(limiter.check(mockRequest("2.2.2.2"))).toBeNull();
    // Both should be blocked on second attempt
    expect(limiter.check(mockRequest("1.1.1.1"))).not.toBeNull();
    expect(limiter.check(mockRequest("2.2.2.2"))).not.toBeNull();
  });

  it("resets after the interval", async () => {
    const limiter = rateLimit({ interval: 50, limit: 1 });
    expect(limiter.check(mockRequest())).toBeNull();
    expect(limiter.check(mockRequest())).not.toBeNull();

    // Wait for window to expire
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(limiter.check(mockRequest())).toBeNull();
  });

  it("includes Retry-After header on 429", () => {
    const limiter = rateLimit({ interval: 60_000, limit: 1 });
    limiter.check(mockRequest());
    const blocked = limiter.check(mockRequest());
    expect(blocked).not.toBeNull();
    expect(blocked!.headers.get("Retry-After")).toBeTruthy();
  });
});
