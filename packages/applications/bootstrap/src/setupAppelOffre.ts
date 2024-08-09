import { AppelOffre } from '@potentiel-domain/appel-offre';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { seedAppelOffre } from '@potentiel-applications/projectors';

export const setupAppelOffre = async () => {
  await seedAppelOffre();

  AppelOffre.registerAppelOffreQueries({
    list: listProjection,
    find: findProjection,
  });
};
