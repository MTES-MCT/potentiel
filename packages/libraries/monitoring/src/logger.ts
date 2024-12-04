import winston from 'winston';

import { getCapture } from './capture';

// RFC5424 from higher to lower level
export const levels: ReadonlyArray<string> = ['error', 'warn', 'info', 'debug'] as const;

export type Level = (typeof levels)[number];

export type Logger = {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(error: Error | string, meta?: Record<string, unknown>): void;
};

type GetLogger = (serviceName?: string) => Logger;

const getLevel = (): Level => {
  const level = process.env.LOGGER_LEVEL;

  if (isLoggerLevel(level)) {
    return level;
  }

  return 'error';
};

const getApplicationName = () => process.env.APPLICATION_NAME;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isLoggerLevel = (value: any): value is Level => {
  return levels.includes(value);
};

let logger: Logger | undefined;

/**
 * We are currently using a custom formatter because we don't really have monitoring capabilities.
 * In the futur, we can switch to logstash if beta.gouv.fr setup something like ELK
 */
const customFormat = winston.format((info) => {
  if ('error' in info && info.error instanceof Error && info.error.cause) {
    info.meta.cause = String(info.error.cause);
  }
  const meta = Object.keys(info.meta)
    .map((k) => `{${k}=${JSON.stringify(info.meta[k])}}`)
    .join(' ');
  info.message = `${info.message} | Service(${info.service}) | Metadata(${meta})`;
  return info;
});

export const getLogger: GetLogger = (serviceName?: string): Logger => {
  if (!logger) {
    const winstonLogger = winston.createLogger({
      format: winston.format.combine(customFormat(), winston.format.cli()),
      transports: [new winston.transports.Console()],
      defaultMeta: {
        service: getApplicationName() || serviceName || 'unknown',
      },
      level: getLevel(),
    });

    logger = {
      debug: (message, meta = {}) => {
        winstonLogger.debug(message, { meta });
        getCapture()?.debug(message, meta);
      },
      info: (message, meta = {}) => {
        winstonLogger.info(message, { meta });
        getCapture()?.info(message, meta);
      },
      warn: (message, meta = {}) => {
        winstonLogger.warn(message, { meta });
        getCapture()?.warn(message, meta);
      },
      error: (error, meta = {}) => {
        if (typeof error === 'string') {
          error = new Error(error);
        }

        winstonLogger.error(error.message, { meta, error });
        getCapture()?.error(error, meta);
      },
    };
  }

  return logger;
};

export const resetLogger = () => {
  logger = undefined;
};
