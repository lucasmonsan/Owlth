import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/public';

Sentry.init({
  dsn: env.PUBLIC_GLITCHTIP_DSN,
  environment: import.meta.env.PROD ? 'production' : 'development',
  tracesSampleRate: 1.0
});

export const handleError = Sentry.handleErrorWithSentry();
