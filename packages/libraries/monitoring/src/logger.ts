import winston from 'winston';

import { getLevel, Level } from './level';
import { consoleTransport } from './console.transport';
import { Logger } from './getLogger';

let logger: (Logger & { child?: (props: Object) => Logger }) | undefined;

type InitLoggerProps = {
  level?: Level;
  transports?: winston.transport[];
};

export const forkLogger = (service?: string): Logger => {
  if (!logger) return console;
  if (!logger.child) return logger;
  return logger.child({ service });
};

export const initLogger = ({ level = getLevel(), transports = [] }: InitLoggerProps) => {
  if (logger) {
    throw new Error('Logger already initialized');
  }
  logger = winston.createLogger({
    transports: [consoleTransport(), ...transports],
    level,
  });
};

/**
 * @deprecated use `initLogger`. This function exists for bypassing the logging mechanisms in tests
 */
export const overrideLogger = (_logger: Logger) => {
  logger = _logger;
};

export const resetLogger = () => {
  logger = undefined;
};
