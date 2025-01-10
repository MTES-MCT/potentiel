import { forkLogger } from './logger';

export type Logger = {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(error: Error | string, meta?: Record<string, unknown>): void;
};

export const getLogger = (service?: string): Logger => {
  const logger = forkLogger(service);

  return {
    debug: (message, meta = {}) => {
      logger.debug(message, { meta });
    },
    info: (message, meta = {}) => {
      logger.info(message, { meta });
    },
    warn: (message, meta = {}) => {
      logger.warn(message, { meta });
    },
    error: (error, meta = {}) => {
      if (typeof error === 'string') {
        const e = new Error(error);
        logger.error(e.message, { meta, error: e });
        return;
      }
      logger.error(error.message, { meta, error });
    },
  };
};
