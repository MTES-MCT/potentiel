import winston from 'winston';

import { getLevel, Level } from './level';
import { consoleTransport } from './console.transport';
import { Logger } from './getLogger';

let winstonLogger: winston.Logger | undefined;

type InitLoggerProps = {
  level?: Level;
  transports?: winston.transport[];
};

export const forkLogger = (service?: string): Logger => {
  if (!winstonLogger) return console;
  return winstonLogger.child({ service });
};

export const initLogger = ({ level = getLevel(), transports = [] }: InitLoggerProps) => {
  if (winstonLogger) {
    throw new Error('Logger already initialized');
  }
  winstonLogger = winston.createLogger({
    transports: [consoleTransport(), ...transports],
    level,
  });
};

export const resetLogger = () => {
  winstonLogger = undefined;
};
