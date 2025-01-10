import { initLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from './sentry.transport';

export const setupLogger = () => {
  initLogger({
    transports: [new SentryTransport()],
  });
};
