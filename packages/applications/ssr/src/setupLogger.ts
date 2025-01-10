import { initLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';

export const setupLogger = () => {
  initLogger({
    transports: [new SentryTransport()],
  });
};
