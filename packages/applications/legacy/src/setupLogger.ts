import { initLogger } from '@potentiel-libraries/monitoring';
import { createLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from './sentry.transport';

export const setupLogger = () => {
  const logger = createLogger({
    transports: [new SentryTransport()],
  });
  initLogger(logger);
};
