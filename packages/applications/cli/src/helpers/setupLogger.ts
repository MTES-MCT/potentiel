import { getLogger, initLogger, resetLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';
import { createLogger } from '@potentiel-libraries/monitoring/winston';

type Props = {
  service: string | undefined;
  defaultMeta: Record<string, unknown>;
};

export const setupLogger = ({ defaultMeta, service }: Props) => {
  type Transports = Parameters<typeof createLogger>[0]['transports'];

  const transports: Transports = [new SentryTransport()];

  const logger = createLogger({
    transports,
    defaultMeta,
  });

  initLogger(logger);
  if (service) {
    const loggerWithService = getLogger(service);
    resetLogger();
    initLogger(loggerWithService);
  }
};
