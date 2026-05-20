'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ backgroundColor: '#F7F0E3', margin: 0, fontFamily: 'sans-serif' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#2C1F14',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C4A882',
              marginBottom: '1.5rem',
            }}
          >
            Critical Error
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 300,
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(44,31,20,0.5)',
              maxWidth: '24rem',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
            }}
          >
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            onClick={reset}
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#2C1F14',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid rgba(44,31,20,0.3)',
              paddingBottom: '2px',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
