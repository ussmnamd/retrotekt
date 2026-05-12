// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a92e762a02d1aacab66a4b3581bd17d5@o4511378251907072.ingest.us.sentry.io/4511378352373760",

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  enableLogs: true,
});
