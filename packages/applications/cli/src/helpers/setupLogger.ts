// oclif-logger.ts
import { format } from 'node:util';

import type { Interfaces } from '@oclif/core';

import { getLogger, initLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';
import { createLogger } from '@potentiel-libraries/monitoring/winston';

export const setupLogger = (defaultMeta: Record<string, unknown>) => {
  type Transports = Parameters<typeof createLogger>[0]['transports'];

  const transports: Transports = [new SentryTransport()];

  const logger = createLogger({
    transports,
    defaultMeta,
  });

  initLogger(logger);
};

export const mapToOclifLogger = (namespace: string): Interfaces.Logger => {
  const logger = getLogger(namespace);
  return {
    child: (ns: string, delimiter?: string) =>
      mapToOclifLogger(`${namespace}-${delimiter ?? ':'}${ns}`),
    debug: (formatter: unknown, ...args: unknown[]) => logger.debug(format(formatter, ...args)),
    error: (formatter: unknown, ...args: unknown[]) => logger.error(format(formatter, ...args)),
    info: (formatter: unknown, ...args: unknown[]) => logger.info(format(formatter, ...args)),
    trace: (formatter: unknown, ...args: unknown[]) => logger.debug(format(formatter, ...args)),
    warn: (formatter: unknown, ...args: unknown[]) => logger.warn(format(formatter, ...args)),
    namespace,
  };
};
