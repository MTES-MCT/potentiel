import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { getLogger } from '@potentiel-libraries/monitoring';

import { removeProjectionByCategory } from '../../infrastructure/removeProjectionByCategory';
import { createProjection } from '../../infrastructure/createProjection';

export const seedAppelOffre = async () => {
  const logger = getLogger('Projectors.appel-offre.seedAppelOffre');

  logger.info('Starting to seed referential data...');

  // Delete all appel offre projections
  logger.info('Removing all appel offre projections...');
  await removeProjectionByCategory('appel-offre');

  // Seed all appels offres from inmemory data
  logger.info('Add all appel offre in memory data as projections...');

  for (const appelOffre of appelsOffreData) {
    const appelOffreReadModelKey: `${string}|${string}` = `appel-offre|${appelOffre.id}`;
    await createProjection(appelOffreReadModelKey, appelOffre);
  }
};
