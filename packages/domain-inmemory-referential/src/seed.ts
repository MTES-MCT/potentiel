import { executeQuery } from '@potentiel/pg-helpers';
import { appelsOffreData } from './appelOffre';
import { AppelOffreReadModelKey } from '@potentiel/domain-views';

export const seed = async () => {
  // Delete all appel offre projections
  await executeQuery(`delete from domain_views.projection where key like $1`, 'appel-offre|%');

  // Seed all appels offres from inmemory data
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
