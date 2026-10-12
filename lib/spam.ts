// Cheap bot checks for the contact form that need no third-party service.
//
// - Honeypot: the form renders a visually hidden "website" field. People never
//   see it; form-filling bots usually do and fill it in.
// - Fill time: the form sends when it was first rendered. Real people take
//   more than a few seconds to write an inquiry; scripts post instantly or
//   skip the field entirely.

export const MIN_FILL_MS = 3000;

export interface SpamSignals {
  website?: string;
  startedAt?: number;
}

export type SpamVerdict = 'ok' | 'honeypot' | 'too-fast' | 'no-timestamp';

export function checkSpam({ website, startedAt }: SpamSignals, now = Date.now()): SpamVerdict {
  if (website && website.trim() !== '') return 'honeypot';
  if (typeof startedAt !== 'number') return 'no-timestamp';
  if (now - startedAt < MIN_FILL_MS) return 'too-fast';
  return 'ok';
}
