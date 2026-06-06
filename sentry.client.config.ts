import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.NEXT_PUBLIC_RELEASE || undefined,
  environment: process.env.NEXT_PUBLIC_ENV || (process.env.NODE_ENV === "production" ? "production" : "development"),
  tracesSampleRate: 0.01,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});
