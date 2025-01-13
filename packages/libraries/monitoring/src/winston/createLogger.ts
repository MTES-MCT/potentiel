import winston from 'winston';

import { getLevel, Level } from '../level';

import { consoleTransport } from './console.transport';

type InitLoggerProps = {
  level?: Level;
  transports?: winston.transport[];
  defaultMeta?: Record<string, unknown>;
};

export const createLogger = ({
  level = getLevel(),
  transports = [],
  defaultMeta,
}: InitLoggerProps) => {
  return winston.createLogger({
    transports: [consoleTransport(), ...transports],
    level,
    defaultMeta,
  });
};
