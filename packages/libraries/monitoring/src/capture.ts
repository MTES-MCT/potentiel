import * as Sentry from '@sentry/node';

export type Capture = {
  debug(message: string, meta: Record<string, unknown>): void;
  info(message: string, meta: Record<string, unknown>): void;
  warn(message: string, meta: Record<string, unknown>): void;
  error(error: Error, meta: Record<string, unknown>): void;
};

type GetCapture = () => Capture | undefined;

let captureInstance: Capture | undefined;

export const getCapture: GetCapture = (): Capture | undefined => {
  if (!captureInstance) {
    const sentryDsn = process.env.SENTRY_DSN;

    if (sentryDsn) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 1.0,
      });

      const capture = (
        level: Sentry.SeverityLevel,
        message: string,
        context: Record<string, unknown>,
      ) => {
        const scope = Sentry.getCurrentHub().getScope();

        scope.addBreadcrumb({
          message,
          data: context,
          level,
        });

        scope.setExtra('context', context);
      };

      captureInstance = {
        warn: (message: string, context: Record<string, unknown>) =>
          capture('warning', message, context),
        info: (message: string, context: Record<string, unknown>) =>
          capture('info', message, context),
        error: (error: Error, context: Record<string, unknown>) => {
          capture('error', error.message, context);
          Sentry.getCurrentHub().captureException(error);
        },
        debug: (message: string, context: Record<string, unknown>) =>
          capture('debug', message, context),
      };
    }
  }

  return captureInstance;
};
