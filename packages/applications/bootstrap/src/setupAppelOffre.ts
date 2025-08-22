import { seedAppelOffre } from '@potentiel-applications/projectors';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupAppelOffre = async () => {
  await seedAppelOffre();

  AppelOffre.registerAppelOffreQueries({
    list: listProjection,
    find: findProjection,
  });
};
