import * as Sentry from '@sentry/nextjs';

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

Sentry.init({
  dsn: "https://a92e762a02d1aacab66a4b3581bd17d5@o4511378251907072.ingest.us.sentry.io/4511378352373760",
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
});
