import { initLogger } from '@potentiel-libraries/monitoring';
import { createLogger } from '@potentiel-libraries/monitoring/winston';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';

export const setupLogger = () => {
  const logger = createLogger({
    transports: [new SentryTransport()],
  });
  initLogger(logger);
};
