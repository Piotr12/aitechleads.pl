import { globalSingleton } from "./singleton";

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets; 0 when the hit was allowed. */
  retryAfterSeconds: number;
}

export interface RateLimiter {
  /** Counts one hit for `key` and says whether it is still within the limit. */
  hit(key: string, now?: number): RateLimitResult;
}

/**
 * A fixed-window counter per key, kept in memory. Caveman grade: good enough for one server
 * process (which is what we run), forgotten on restart, no help against a real flood.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const windows = new Map<string, { count: number; resetAt: number }>();
  let nextSweep = 0;

  return {
    hit(key, now = Date.now()) {
      // Drop expired windows once per window, so the map only holds keys seen recently.
      if (now >= nextSweep) {
        for (const [k, w] of windows) if (w.resetAt <= now) windows.delete(k);
        nextSweep = now + windowMs;
      }
      let window = windows.get(key);
      if (!window || window.resetAt <= now) {
        window = { count: 0, resetAt: now + windowMs };
        windows.set(key, window);
      }
      window.count++;
      return window.count <= limit
        ? { ok: true, retryAfterSeconds: 0 }
        : { ok: false, retryAfterSeconds: Math.ceil((window.resetAt - now) / 1000) };
    },
  };
}

/**
 * A rate limiter shared by the whole process under `name`. Next.js bundles server code more than
 * once (pages, actions, proxy), so a plain module-level limiter would count each copy separately.
 */
export function sharedRateLimiter(name: string, options: { limit: number; windowMs: number }): RateLimiter {
  return globalSingleton(`rate-limit:${name}`, () => createRateLimiter(options));
}
