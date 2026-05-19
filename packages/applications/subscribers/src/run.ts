import dotenv from 'dotenv';

import { bootstrap, logMiddleware } from '@potentiel-applications/bootstrap';
import {
  executeSubscribersRetry,
  listDanglingSubscribers,
} from '@potentiel-infrastructure/pg-event-sourcing';
import { getLogger } from '@potentiel-libraries/monitoring';
import { killPool } from '@potentiel-libraries/pg-helpers';

import { startSubscribers } from './index.js';
import { setupLogger } from './setupLogger.js';

const main = async () => {
  dotenv.config();
  setupLogger();

  const logger = getLogger('subscribers');
  logger.info('Starting subscribers...');

  // Bootstrap application for:
  // - regular sagas (that send commands)
  // - attestation saga (that uses queries)
  await bootstrap({
    middlewares: [logMiddleware],
  });

  const unlisten = await startSubscribers({});

  const danglingSubscribers = await listDanglingSubscribers();
  if (danglingSubscribers.length > 0) {
    logger.warn('Some subscribers are no longer listed in the application', {
      subscribers: danglingSubscribers,
    });
  }

  await executeSubscribersRetry();

  process.on('SIGTERM', async () => {
    logger.info('Gracefully shutting down...');
    await unlisten();
    await killPool();
    logger.info('Shut down complete.');
  });
};

void main();
