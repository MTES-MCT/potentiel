import { Command } from '@oclif/core';
import z from 'zod';

import { getLogger, initLogger, resetLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';
import { createLogger } from '@potentiel-libraries/monitoring/winston';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { dbSchema, loggerSchema, sentrySchema } from '#helpers';
import { reportCronStatus } from '#helpers/monitoring';

const envSchema = z.object({
  ...dbSchema.shape,
  ...sentrySchema.shape,
  ...loggerSchema.shape,
});

export class PendingAcknowlegement extends Command {
  static description = 'Checks that there are no overdue pending_acknowledgement in the database';

  async init() {
    envSchema.parse(process.env);

    resetLogger();
    const logger = createLogger({
      transports: [new SentryTransport()],
    });
    initLogger(logger);
  }

  async run() {
    const pendingAcknowledgements = await executeSelect<{
      stream_category: string;
      subscriber_name: string;
      error?: string;
    }>(
      `select  
        stream_category,
        subscriber_name,       
        error
      from 
        event_store.pending_acknowledgement
      where
        created_at < (now() - interval '10 minutes')::text;`,
    );

    const logger = getLogger('Monitoring');

    if (pendingAcknowledgements.length === 0) {
      logger.info('No pending_acknowledgement found');
    } else {
      logger.error(new DatabaseHasPendingAcknowledgements(), {
        totalCount: pendingAcknowledgements.length,
        errorCount: pendingAcknowledgements.filter((p) => !!p.error).length,
        subscribers: [
          ...new Set(
            pendingAcknowledgements.map((pa) => `${pa.stream_category}|${pa.subscriber_name}`),
          ),
        ],
      });
    }

    await reportCronStatus('pending-acknowledgement', 'ok');
  }
}

class DatabaseHasPendingAcknowledgements extends Error {
  constructor() {
    super('Database has pending acknowledgements');
  }
}
