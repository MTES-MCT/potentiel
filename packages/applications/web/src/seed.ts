import { executeQuery } from '@potentiel/pg-helpers';
import { appelsOffreData } from '@potentiel/domain-inmemory-referential';
import { AppelOffreReadModelKey } from '@potentiel/domain-views';
import { getLogger } from '@potentiel/monitoring';

export const seed = async () => {
  getLogger().info('Starting to seed referential data...');

  // Delete all appel offre projections
  getLogger().info('Removing all appel offre projections...');
  await executeQuery(`delete from domain_views.projection where key like $1`, 'appel-offre|%');

  // Seed all appels offres from inmemory data
  getLogger().info('Add all appel offre in memory data as projections...');
  await Promise.all(
    appelsOffreData.map((appelOffre) => {
      const appelOffreReadModelKey: AppelOffreReadModelKey = `appel-offre|${appelOffre.id}`;
      return executeQuery(
        `insert into domain_views.projection values($1, $2)`,
        appelOffreReadModelKey,
        appelOffre,
      );
    }),
  );
};
