import { Command } from '@oclif/core';

import { createLogger, getLogger, initLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from '@potentiel-libraries/monitoring/sentry';
import { killPool, executeSelect } from '@potentiel-libraries/pg-helpers';

import { MattermostTransport } from '../../helpers/monitoring/mattermost';
import { reportCronStatus } from '../../helpers/monitoring/sentry';

export class PendingAcknowlegement extends Command {
  static description = 'Checks that there are no overdue pending_acknowledgement in the database';

  async init() {
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

  protected async finally() {
    await killPool();
  }

  async run() {
    const pendingAcknowledgements = await executeSelect<{
      stream_category: string;
      subscriber_name: string;
      stream_id: string;
      created_at: string;
      version: number;
      error?: string;
    }>(
      `select  
        stream_category,
        subscriber_name,
        stream_id,
        created_at,
        version 
      from 
        event_store.pending_acknowledgement
      where
        created_at < (now() - interval '10 minutes')::text;`,
    );

    const logger = getLogger('Monitoring');

    if (pendingAcknowledgements.length === 0) {
      logger.info('No pending_acknowledgement found');
      return;
    }

    logger.error(new DatabaseHasPendingAcknowledgements(), {
      totalCount: pendingAcknowledgements.length,
      errorCount: pendingAcknowledgements.filter((p) => !!p.error).length,
      subscribers: [
        ...new Set(
          pendingAcknowledgements.map((pa) => `${pa.stream_category}|${pa.subscriber_name}`),
        ),
      ],
    });

    await reportCronStatus('pending-acknowledgement', 'ok');
  }
}

class DatabaseHasPendingAcknowledgements extends Error {
  constructor() {
    super('Database has pending acknowledgements');
  }
}
