import { stageSchema } from './config.js';

export const throwIfStageProduction = () => {
  const { APPLICATION_STAGE } = stageSchema.parse(process.env);
  if (APPLICATION_STAGE === 'production') {
    console.log(`⛔️ Cette commande ne doit pas être lancée en production`);

    process.exit(1);
  }
};

export const restrictUsageToStages = (...expectedEnvs: string[]) => {
  const { APPLICATION_STAGE } = stageSchema.parse(process.env);
  if (!expectedEnvs.includes(APPLICATION_STAGE)) {
    console.log(
      `⛔️ Cette commande n'est pas disponible dans l'environnement actuel et ne doit pas être lancée en production`,
      {
        currentEnv: APPLICATION_STAGE,
        expectedEnvs,
      },
    );

    return true;
  }

  return false;
};
