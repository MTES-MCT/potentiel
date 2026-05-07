import { initLogger } from '@potentiel-libraries/monitoring';
import { createLogger } from '@potentiel-libraries/monitoring/winston';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';

export const setupLogger = (defaultMeta: Record<string, unknown>) => {
  type Transports = Parameters<typeof createLogger>[0]['transports'];

  const transports: Transports = [new SentryTransport()];

  const logger = createLogger({
    transports,
    defaultMeta,
  });

  initLogger(logger);
};
