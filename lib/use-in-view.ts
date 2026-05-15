'use client';
import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number;
}

// Generic type parameter lets callers type the ref correctly (HTMLDivElement, HTMLElement, etc.)
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMarginOrOptions: string | UseInViewOptions = '200px'
) {
  const options: UseInViewOptions =
    typeof rootMarginOrOptions === 'string'
      ? { rootMargin: rootMarginOrOptions }
      : rootMarginOrOptions;

  const { rootMargin = '0px', threshold } = options;

  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observerOptions: IntersectionObserverInit = { rootMargin };
    if (threshold !== undefined) observerOptions.threshold = threshold;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      observerOptions
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, rootMargin, threshold]);
  return { ref, inView };
}
