import { Command } from '@oclif/core';
import z from 'zod';

import {
  cleanStatistiquesPubliques,
  computeStatistiquesPubliques,
} from '@potentiel-statistiques/statistiques-publiques';

import { appSchema, dbSchema, verifyIfEnvIsProduction } from '#helpers';

const envSchema = z.object({
  ...appSchema.shape,
  ...dbSchema.shape,
});

export default class ExtraireStats extends Command {
  static monitoringSlug = 'extraire-donnees-statistiques-publiques';

  static override description = 'Extrait les données des statistiques publiques';

  async init() {
    const { APPLICATION_STAGE } = envSchema.parse(process.env);

    verifyIfEnvIsProduction(APPLICATION_STAGE);
  }

  public async run(): Promise<void> {
    console.info('Lancement du script...');

    console.info('Clean données statistiques publiques existantes');
    await cleanStatistiquesPubliques();

    console.info('Compute nouvelles données statistiques publiques');
    await computeStatistiquesPubliques();

    console.info('Fin du script ✨');
  }
}
