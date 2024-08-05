import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.SENTRY_RELEASE,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
});
