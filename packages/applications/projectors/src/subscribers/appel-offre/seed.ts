import { appelsOffreData } from '@potentiel-domain/inmemory-referential';
import { getLogger } from '@potentiel-libraries/monitoring';
import {
  removeProjectionByCategory,
  createProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export const seedAppelOffre = async () => {
  getLogger().info('Starting to seed referential data...');

  // Delete all appel offre projections
  getLogger().info('Removing all appel offre projections...');
  await removeProjectionByCategory('appel-offre');

  // Seed all appels offres from inmemory data
  getLogger().info('Add all appel offre in memory data as projections...');

  for (const appelOffre of appelsOffreData) {
    await createProjection<AppelOffre.AppelOffreEntity>(`appel-offre|${appelOffre.id}`, appelOffre);
  }
};
