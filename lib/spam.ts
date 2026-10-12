// Cheap bot checks for the contact form that need no third-party service.
//
// - Honeypot: the form renders a visually hidden "website" field. People never
//   see it; form-filling bots usually do and fill it in.
// - Fill time: the form sends how long it was open before submit, measured
//   in the browser so a wrong client clock can't drop real inquiries. Real
//   people take more than a few seconds to write an inquiry; scripts post
//   instantly or skip the field entirely.

export const MIN_FILL_MS = 3000;

export interface SpamSignals {
  website?: string;
  elapsedMs?: number;
}

export type SpamVerdict = 'ok' | 'honeypot' | 'too-fast' | 'no-timestamp';

export function checkSpam({ website, elapsedMs }: SpamSignals): SpamVerdict {
  if (website && website.trim() !== '') return 'honeypot';
  if (typeof elapsedMs !== 'number') return 'no-timestamp';
  if (elapsedMs < MIN_FILL_MS) return 'too-fast';
  return 'ok';
}
