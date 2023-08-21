import { appelsOffreData } from '@potentiel/domain-inmemory-referential';
import { AppelOffreReadModelKey } from '@potentiel/domain-views';
import { getLogger } from '@potentiel/monitoring';
import { createProjection, removeProjectionByCategory } from '@potentiel/pg-projections';

export const seed = async () => {
  getLogger().info('Starting to seed referential data...');

  // Delete all appel offre projections
  getLogger().info('Removing all appel offre projections...');
  await removeProjectionByCategory('appel-offre');

  // Seed all appels offres from inmemory data
  getLogger().info('Add all appel offre in memory data as projections...');

  for (const appelOffre of appelsOffreData) {
    const appelOffreReadModelKey: AppelOffreReadModelKey = `appel-offre|${appelOffre.id}`;
    await createProjection(appelOffreReadModelKey, appelOffre);
  }
};
