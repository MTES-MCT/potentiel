import { Command } from '@oclif/core';
import { z } from 'zod';

import {
  cleanStatistiquesPubliques,
  computeStatistiquesPubliques,
} from '@potentiel-statistiques/statistiques-publiques';

const configSchema = z.object({
  EVENT_STORE_CONNECTION_STRING: z.string(),
});

export default class ExtraireStats extends Command {
  static override description =
    'Extrait les données des statistiques publiques (permet de tester la tâche planifiée dédiée)';

  static override args = {};

  static override flags = {};

  public async init() {
    const { success } = configSchema.safeParse(process.env);
    console.info(`Env variables defined : ${success}`);
  }

  public async run(): Promise<void> {
    console.info('Lancement du script...');

    console.info('Clean données statistiques publiques existantes');
    await cleanStatistiquesPubliques();

    console.info('Compute nouvelles données statistiques publiques');
    await computeStatistiquesPubliques();

    console.info('Fin du script ✨');

    process.exit(0);
  }
}
