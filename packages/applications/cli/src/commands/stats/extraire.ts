import { Command } from '@oclif/core';
import { z } from 'zod';

import {
  cleanStatistiquesPubliques,
  computeStatistiquesPubliques,
} from '@potentiel-statistiques/statistiques-publiques';

import { getHealthcheckClient, HealthcheckClient } from '../../helpers/healthcheck';

const configSchema = z.object({
  DATABASE_CONNECTION_STRING: z.string().url(),
  SENTRY_CRONS: z.string().optional(),
  APPLICATION_STAGE: z.string(),
});

export default class ExtraireStats extends Command {
  private healthcheckClient!: HealthcheckClient;
  static monitoringSlug = 'extraire-donnees-statistiques-publiques';

  static override description =
    'Extrait les données des statistiques publiques (permet de tester la tâche planifiée dédiée)';

  static override args = {};

  static override flags = {};

  public async init() {
    const config = configSchema.parse(process.env);
    this.healthcheckClient = getHealthcheckClient({
      healthcheckUrl: config.SENTRY_CRONS,
      slug: ExtraireStats.monitoringSlug,
      environment: config.APPLICATION_STAGE,
    });

    await this.healthcheckClient.start();
  }

  async finally(error: Error | undefined) {
    if (error) {
      await this.healthcheckClient?.error();
    } else {
      await this.healthcheckClient.success();
    }
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
