// Fixed-window rate limiter.
//
// Uses Upstash Redis over its REST API when credentials are configured, so
// counts survive cold starts and are shared by every serverless instance.
// Without credentials (local dev, previews) it falls back to an in-process
// Map, which is per-instance and resets on redeploy.
//
// Env vars, either naming works:
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (Upstash console)
//   KV_REST_API_URL / KV_REST_API_TOKEN                (Vercel Marketplace integration)

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

const memory = new Map<string, { count: number; resetAt: number }>();

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

function allowedInMemory(key: string, { limit, windowMs }: RateLimitOptions): boolean {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

async function countInRedis(
  { url, token }: { url: string; token: string },
  key: string,
  windowMs: number
): Promise<number> {
  // SET NX starts the window with its expiry; INCR then counts this hit.
  // Both run in one round trip and the expiry is never reset mid-window.
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['SET', key, '0', 'PX', String(windowMs), 'NX'],
      ['INCR', key],
    ]),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const data = (await res.json()) as Array<{ result?: unknown; error?: string }>;
  const incr = data[1];
  if (!incr || incr.error || typeof incr.result !== 'number') {
    throw new Error(`Upstash INCR failed: ${incr?.error ?? 'bad response'}`);
  }
  return incr.result;
}

export async function rateLimit(key: string, options: RateLimitOptions): Promise<boolean> {
  const redis = redisConfig();
  if (!redis) return allowedInMemory(key, options);

  try {
    const count = await countInRedis(redis, `ratelimit:${key}`, options.windowMs);
    return count <= options.limit;
  } catch (err) {
    // Don't lose real inquiries if Redis is down; degrade to the local limit.
    console.error('[rate-limit] Redis unavailable, using in-memory fallback:', err);
    return allowedInMemory(key, options);
  }
}

/** Test helper: clears the in-memory fallback. */
export function resetMemoryRateLimit() {
  memory.clear();
}
