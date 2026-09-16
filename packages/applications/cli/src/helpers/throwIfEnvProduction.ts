import type { z } from 'zod';

import type { appSchema } from './config.js';

export const throwIfEnvProduction = (env: z.infer<typeof appSchema>['APPLICATION_STAGE']) => {
  if (env === 'production') {
    console.log(`⛔️ Cette commande ne doit pas être lancée en production`);
    return;
  }
};
