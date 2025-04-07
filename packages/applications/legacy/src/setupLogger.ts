import { ElasticsearchTransport } from 'winston-elasticsearch';

import { initLogger } from '@potentiel-libraries/monitoring';
import { createLogger } from '@potentiel-libraries/monitoring';
import { SentryTransport } from './sentry.transport';

export const setupLogger = () => {
  type Transports = Parameters<typeof createLogger>[0]['transports'];

  const transports: Transports = [new SentryTransport()];

  const elasticsearchUrl = process.env.ELASTICSEARCH_URL || '';
  if (elasticsearchUrl) {
    transports.push(
      new ElasticsearchTransport({
        clientOpts: { node: elasticsearchUrl },
      }),
    );
  }

  const logger = createLogger({
    transports,
  });

  initLogger(logger);
};
