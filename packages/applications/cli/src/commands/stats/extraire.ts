import { Command } from '@oclif/core';

import {
  cleanStatistiquesPubliques,
  computeStatistiquesPubliques,
} from '@potentiel-statistiques/statistiques-publiques';

export default class ExtraireStats extends Command {
  static monitoringSlug = 'extraire-donnees-statistiques-publiques';

  static override description = 'Extrait les données des statistiques publiques';

  public async run(): Promise<void> {
    console.info('Lancement du script...');

    console.info('Clean données statistiques publiques existantes');
    await cleanStatistiquesPubliques();

    console.info('Compute nouvelles données statistiques publiques');
    await computeStatistiquesPubliques();

    console.info('Fin du script ✨');
  }
}
