/**
 * Simple in-memory rate limiter. This is fine for a single long-running
 * server, but on Vercel's serverless functions each instance has its own
 * memory, so this only limits per-instance rather than globally. For real
 * production traffic, swap this for a shared store (e.g. Upstash Redis) —
 * see the README's production security checklist.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
