import { Command } from '@oclif/core';

import { executeSelect } from '@potentiel-libraries/pg-helpers';
import {
  cleanStatistiquesPubliques,
  computeStatistiquesPubliques,
} from '@potentiel-statistiques/statistiques-publiques';

export default class CompareStats extends Command {
  static monitoringSlug = 'extraire-donnees-statistiques-publiques';

  static override description = `Extrait les données des statistiques publiques et compare les données générées aux précédentes (camembert / scalar seulement).
  
  Cette commande effectue réellement la mise à jour, donc il faut penser à remettre la DB à l'état initial entre deux essais`;

  public async run(): Promise<void> {
    const { diffJson } = await import('diff');

    const previous = await fetchData();

    console.info('Clean données statistiques publiques existantes');
    await cleanStatistiquesPubliques();

    console.info('Compute nouvelles données statistiques publiques');
    await computeStatistiquesPubliques();

    const current = await fetchData();

    const diff = diffJson(previous, current);
    const formattedDiff = diff
      .map((part) => {
        const color = part.added ? '\x1b[32m' : part.removed ? '\x1b[31m' : '\x1b[0m';
        return color + part.value + '\x1b[0m';
      })
      .join('');

    console.log(formattedDiff);
  }
}

const fetchData = async () => {
  const camembert = await executeSelect<{ type: string; value: string }>(`
      select 'camembert_'||category ||'_'|| type as "type",value from domain_public_statistic.camembert_statistic;
  `);

  const scalar = await executeSelect<{ type: string; value: string }>(`
      select 'scalar_'||type as type, value from domain_public_statistic.scalar_statistic;
  `);

  return [...camembert, ...scalar].reduce(
    (prev, curr) => ({
      ...prev,
      [curr.type]: curr.value,
    }),
    {} as Record<string, string>,
  );
};
