export type Logger = {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(error: Error | string, meta?: Record<string, unknown>): void;
};

let logger:
  | (Logger & { child?: (props: object) => Logger; defaultMeta?: Record<string, unknown> })
  | undefined;

export const forkLogger = (service?: string): Logger => {
  if (!logger) return console;
  if (!logger.child) return logger;
  return logger.child({ service, defaultMeta: logger.defaultMeta });
};

export const initLogger = (newLogger: Logger) => {
  if (logger) {
    throw new Error('Logger already initialized');
  }
  logger = newLogger;
};

export const resetLogger = () => {
  logger = undefined;
};
