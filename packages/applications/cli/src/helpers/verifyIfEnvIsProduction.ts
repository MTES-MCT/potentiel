import type { z } from 'zod';

import type { appSchema } from './config.js';

export const verifyIfEnvIsProduction = (env: z.infer<typeof appSchema>['APPLICATION_STAGE']) => {
  if (env !== 'production') {
    console.log(`This job can't be executed on ${env} environment`);
    return;
  }
};
