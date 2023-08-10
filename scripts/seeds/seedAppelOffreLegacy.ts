import { executeQuery } from '@potentiel/pg-helpers';
import { appelsOffreStatic } from '../../src/dataAccess/inMemory/appelOffreData';
import { AppelOffreReadModelKey } from '@potentiel/domain-views';

(async () => {
  // Delete all appel offre projections
  await executeQuery(`delete from domain_views.projection where key like $1`, 'appel-offre|%');

  // Seed all appels offres from inmemory data
  await Promise.all(
    appelsOffreStatic.map((appelOffre) => {
      const appelOffreReadModelKey: AppelOffreReadModelKey = `appel-offre|${appelOffre.id}`;
      return executeQuery(
        `insert into domain_views.projection values($1, $2)`,
        appelOffreReadModelKey,
        appelOffre,
      );
    }),
  );
})();
