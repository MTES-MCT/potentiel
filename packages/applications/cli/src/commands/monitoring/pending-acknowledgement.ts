import { Command } from '@oclif/core';

import { getLogger, initLogger, resetLogger } from '@potentiel-libraries/monitoring';
import { createLogger } from '@potentiel-libraries/monitoring/winston';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';
import { executeSelect } from '@potentiel-libraries/pg-helpers';

import { MattermostTransport } from '../../helpers/monitoring/mattermost.js';
import { reportCronStatus } from '../../helpers/monitoring/sentry.js';

export class PendingAcknowlegement extends Command {
  static description = 'Checks that there are no overdue pending_acknowledgement in the database';

  async init() {
    resetLogger();
    const logger = createLogger({
      transports: [
        new SentryTransport(),
        new MattermostTransport({
          level: 'error',
        }),
      ],
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
