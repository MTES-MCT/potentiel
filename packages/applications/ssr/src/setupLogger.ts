import { initLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';
import { createLogger } from '@potentiel-libraries/monitoring/winston';

export const setupLogger = () => {
  type Transports = Parameters<typeof createLogger>[0]['transports'];

  const transports: Transports = [new SentryTransport()];

  const logger = createLogger({
    transports,
  });

  initLogger(logger);
};
