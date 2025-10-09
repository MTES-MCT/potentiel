import { createLogger, getLogger, initLogger } from '@potentiel-libraries/monitoring';
import {
  executeSubscribersRetry,
  listDanglingSubscribers,
} from '@potentiel-infrastructure/pg-event-sourcing';
import { killPool } from '@potentiel-libraries/pg-helpers';

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

  await executeSubscribersRetry();

  const unlisten = await startSubscribers({});

  process.on('SIGTERM', async () => {
    logger.info('Gracefully shutting down...');
    await unlisten();
    await killPool();
    logger.info('Shut down complete.');
  });
};

void main();
