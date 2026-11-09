import type z from 'zod';

import { stageSchema } from './config.js';

export const throwIfStageProduction = () => {
  const { APPLICATION_STAGE } = stageSchema.parse(process.env);
  if (APPLICATION_STAGE === 'production') {
    console.log(`⛔️ Cette commande ne doit pas être lancée en production`);

    process.exit(1);
  }
};

type ApplicationStage = z.infer<typeof stageSchema>['APPLICATION_STAGE'];

export const restrictUsageToStages = (...expectedStages: ApplicationStage[]) => {
  const { APPLICATION_STAGE } = stageSchema.parse(process.env);
  if (!expectedStages.includes(APPLICATION_STAGE)) {
    console.log(
      `⛔️ Cette commande n'est pas disponible dans l'environnement actuel et ne doit pas être lancée en production`,
      {
        currentEnv: APPLICATION_STAGE,
        expectedStages,
      },
    );

    return true;
  }

  return false;
};
