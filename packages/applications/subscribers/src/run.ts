import { createLogger, getLogger, initLogger } from '@potentiel-libraries/monitoring';
import {
  executeSubscribersRetry,
  listDanglingSubscribers,
} from '@potentiel-infrastructure/pg-event-sourcing';
import { killPool } from '@potentiel-libraries/pg-helpers';
import { bootstrap, logMiddleware } from '@potentiel-applications/bootstrap';

import { startSubscribers } from './index.js';

const main = async () => {
  // TODO check sentry
  initLogger(
    createLogger({
      defaultMeta: { service: 'subscribers' },
    }),
  );

  const logger = getLogger('subscribers');
  logger.info('Starting subscribers...');

  const danglingSubscribers = await listDanglingSubscribers();
  if (danglingSubscribers.length > 0) {
    logger.warn('Some subscribers are no longer listed in the application', {
      subscribers: danglingSubscribers,
    });
  }

  // Bootstrap application for:
  // - regular sagas (that send commands)
  // - attestation saga (that uses queries)
  await bootstrap({
    middlewares: [logMiddleware],
  });

  const unlisten = await startSubscribers({});
  await executeSubscribersRetry();

  process.on('SIGTERM', async () => {
    logger.info('Gracefully shutting down...');
    await unlisten();
    await killPool();
    logger.info('Shut down complete.');
  });
};

void main();
