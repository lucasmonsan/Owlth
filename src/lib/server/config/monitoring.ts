import { env } from './env';

export const monitoringConfig = {
  dsn: env.MONITOR_DSN,
  environment: import.meta.env.PROD ? 'production' : 'development',
  tracesSampleRate: 1.0,
  beforeSend(event: any) {
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
      }
    }
    return event;
  }
};
