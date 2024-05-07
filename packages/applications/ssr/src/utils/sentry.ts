import * as Sentry from '@sentry/react';

const initSentry = () => {
  if (Sentry.isInitialized()) {
    return;
  }

  Sentry.init({
    dsn: 'https://43e42aeab2744bfab39610258e1fcc6a@sentry.incubateur.net/132',
    integrations: [Sentry.captureConsoleIntegration({ levels: ['error', 'log', 'info'] })],
    tracesSampleRate: 1.0,
    debug: process.env.NODE_ENV === 'development',
  });
};

export default initSentry;
