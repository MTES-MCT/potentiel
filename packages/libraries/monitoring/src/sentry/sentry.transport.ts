/* eslint-disable @typescript-eslint/no-explicit-any */
// CREDITS: largely inspired by https://github.com/aandrewww/winston-transport-sentry-node
import TransportStream, { TransportStreamOptions } from 'winston-transport';
import Sentry from '@sentry/nextjs';

const LEVELS_MAP: Record<string, Sentry.SeverityLevel> = {
  silly: 'debug',
  verbose: 'debug',
  info: 'info',
  debug: 'debug',
  warn: 'warning',
  error: 'error',
};

class ExtendedError extends Error {
  constructor(info: any) {
    super(info.message);

    this.name = info.name || 'Error';
    if (info.stack && typeof info.stack === 'string') {
      this.stack = info.stack;
    }
  }
}

export class SentryTransport extends TransportStream {
  constructor(opts: TransportStreamOptions = {}) {
    super(opts);

    const { NEXT_PUBLIC_SENTRY_DSN: dsn, NEXT_PUBLIC_APPLICATION_STAGE: environment } = process.env;

    if (dsn && environment !== 'local') {
      Sentry.init({ dsn, environment });
    }
  }

  public log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (this.silent) return callback();

    const { message, level: winstonLevel, ...data } = info;

    const level = LEVELS_MAP[winstonLevel];

    const scope = Sentry.getCurrentScope();
    scope.addBreadcrumb({ message, data, level });
    scope.setExtra('context', data);

    // Capturing Errors / Exceptions
    if (level === 'fatal' || level === 'error') {
      const error =
        Object.values(info).find((value) => value instanceof Error) ?? new ExtendedError(info);
      Sentry.captureException(error, { level });

      return callback();
    }

    // Capturing Messages
    return callback();
  }

  end(...args: any[]) {
    void Sentry.flush().then(() => {
      super.end(...args);
    });
    return this;
  }
}
