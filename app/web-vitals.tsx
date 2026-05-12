'use client';

import { useReportWebVitals } from 'next/web-vitals';
import * as Sentry from '@sentry/nextjs';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Only forward the three Core Web Vitals that matter for SEO
    if (!['LCP', 'CLS', 'INP'].includes(metric.name)) return;

    Sentry.captureEvent({
      message: `Web Vital: ${metric.name}`,
      level: 'info',
      tags: {
        'web_vital.name': metric.name,
        'web_vital.rating': metric.rating,
      },
      extra: {
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      },
    });
  });

  return null;
}
