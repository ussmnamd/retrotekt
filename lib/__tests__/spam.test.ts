import { describe, it, expect } from 'vitest';
import { checkSpam, MIN_FILL_MS } from '@/lib/spam';

describe('checkSpam', () => {
  it('passes a human-paced submission with an empty honeypot', () => {
    expect(checkSpam({ website: '', elapsedMs: MIN_FILL_MS + 1 })).toBe('ok');
  });

  it('flags a filled honeypot', () => {
    expect(checkSpam({ website: 'http://spam.example', elapsedMs: 60_000 })).toBe('honeypot');
  });

  it('flags submissions faster than the minimum fill time', () => {
    expect(checkSpam({ elapsedMs: 500 })).toBe('too-fast');
  });

  it('flags a missing timestamp', () => {
    expect(checkSpam({})).toBe('no-timestamp');
  });
});
