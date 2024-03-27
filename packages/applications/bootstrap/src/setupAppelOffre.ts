import { registerAppelOffreQueries } from '@potentiel-domain/appel-offre';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';
import { seedAppelOffre } from '@potentiel-applications/projectors';

export const setupAppelOffre = async () => {
  await seedAppelOffre();

  registerAppelOffreQueries({
    list: listProjection,
    find: findProjection,
  });
};
