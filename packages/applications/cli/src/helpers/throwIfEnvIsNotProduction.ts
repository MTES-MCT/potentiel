import type { z } from 'zod';

import type { appSchema } from './config.js';

export const throwIfEnvIsNotProduction = (env: z.infer<typeof appSchema>['APPLICATION_STAGE']) => {
  if (env !== 'production') {
    console.log(`⛔️ Cette commande ne peut être exécutée qu'en production`);
    return;
  }
};
