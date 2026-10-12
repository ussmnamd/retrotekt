import { describe, it, expect } from 'vitest';
import { checkSpam, MIN_FILL_MS } from '@/lib/spam';

const now = 1_000_000;

describe('checkSpam', () => {
  it('passes a human-paced submission with an empty honeypot', () => {
    expect(checkSpam({ website: '', startedAt: now - MIN_FILL_MS - 1 }, now)).toBe('ok');
  });

  it('flags a filled honeypot', () => {
    expect(checkSpam({ website: 'http://spam.example', startedAt: now - 60_000 }, now)).toBe('honeypot');
  });

  it('flags submissions faster than the minimum fill time', () => {
    expect(checkSpam({ startedAt: now - 500 }, now)).toBe('too-fast');
  });

  it('flags a missing timestamp', () => {
    expect(checkSpam({}, now)).toBe('no-timestamp');
  });
});
