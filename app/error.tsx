'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[app/error]', error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="bg-background min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-secondary mb-6">
        Error
      </p>
      <h2
        className="font-heading text-primary leading-[0.9] tracking-[-0.03em] mb-6"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
      >
        Something went wrong.
      </h2>
      <p className="font-body text-[14px] text-primary/50 max-w-sm mb-10 leading-relaxed">
        An unexpected error occurred. Try again, or come back in a moment.
      </p>
      <div className="flex items-center gap-8">
        <button
          onClick={reset}
          className="font-body text-[11px] tracking-[0.2em] uppercase text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-colors duration-200"
        >
          Try again
        </button>
        <a
          href="/"
          className="font-body text-[11px] tracking-[0.2em] uppercase text-primary/40 hover:text-primary transition-colors duration-200"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
