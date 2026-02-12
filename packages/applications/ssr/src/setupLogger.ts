import { ElasticsearchTransport } from 'winston-elasticsearch';

import { initLogger } from '@potentiel-libraries/monitoring';
import { createLogger } from '@potentiel-libraries/monitoring/winston';

export const setupLogger = () => {
  type Transports = Parameters<typeof createLogger>[0]['transports'];

  const transports: Transports = [
    // new SentryTransport()
  ];

  const elasticsearchUrl = process.env.ELASTICSEARCH_URL || '';
  if (elasticsearchUrl) {
    const elasticSearchTransport = new ElasticsearchTransport({
      clientOpts: { node: elasticsearchUrl },
    });
    elasticSearchTransport.on('error', console.error);

    transports.push(elasticSearchTransport);
  }

  const logger = createLogger({
    transports,
  });

  initLogger(logger);
};
