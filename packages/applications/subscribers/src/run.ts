import { createLogger, initLogger } from '@potentiel-libraries/monitoring';

import { startSubscribers } from './startSubscribers';

// TODO check sentry
initLogger(
  createLogger({
    defaultMeta: { service: 'subscribers' },
  }),
);

void startSubscribers({});
