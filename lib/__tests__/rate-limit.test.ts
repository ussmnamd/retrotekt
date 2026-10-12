import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { rateLimit, resetMemoryRateLimit } from '@/lib/rate-limit';

const opts = { limit: 3, windowMs: 60_000 };

describe('rateLimit (in-memory fallback)', () => {
  beforeEach(() => {
    resetMemoryRateLimit();
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('KV_REST_API_URL', '');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('allows up to the limit then blocks', async () => {
    for (let i = 0; i < 3; i++) expect(await rateLimit('a', opts)).toBe(true);
    expect(await rateLimit('a', opts)).toBe(false);
    expect(await rateLimit('b', opts)).toBe(true);
  });
});

describe('rateLimit (Upstash)', () => {
  beforeEach(() => {
    resetMemoryRateLimit();
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://example.upstash.io/');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'tkn');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  function mockCount(count: number) {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ result: 'OK' }, { result: count }]), { status: 200 })
    );
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  }

  it('sends SET NX + INCR in one pipeline call', async () => {
    const fetchMock = mockCount(1);
    expect(await rateLimit('1.2.3.4', opts)).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://example.upstash.io/pipeline');
    expect(init.headers.Authorization).toBe('Bearer tkn');
    expect(JSON.parse(init.body)).toEqual([
      ['SET', 'ratelimit:1.2.3.4', '0', 'PX', '60000', 'NX'],
      ['INCR', 'ratelimit:1.2.3.4'],
    ]);
  });

  it('blocks once the shared count exceeds the limit', async () => {
    mockCount(3);
    expect(await rateLimit('x', opts)).toBe(true);
    mockCount(4);
    expect(await rateLimit('x', opts)).toBe(false);
  });

  it('falls back to in-memory when Redis errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    for (let i = 0; i < 3; i++) expect(await rateLimit('y', opts)).toBe(true);
    expect(await rateLimit('y', opts)).toBe(false);
  });
});
