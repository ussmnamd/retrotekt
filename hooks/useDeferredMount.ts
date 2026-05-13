"use client";
import { useEffect, useState } from "react";

/**
 * Returns true after the browser reports idle time post-load.
 * Falls back to setTimeout when requestIdleCallback is unavailable.
 * Used to defer heavy components (e.g. Hero3D) until after FCP so LCP
 * text paints before Three.js bundle loads.
 */
export function useDeferredMount(maxDelayMs = 1200): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: maxDelayMs });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setReady(true), maxDelayMs);
    return () => clearTimeout(t);
  }, [maxDelayMs]);
  return ready;
}
