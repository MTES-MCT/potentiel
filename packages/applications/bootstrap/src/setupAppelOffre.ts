import { registerAppelOffreQueries } from '@potentiel-domain/appel-offre';
import { findProjection, listProjectionV2 } from '@potentiel-infrastructure/pg-projections';
import { seedAppelOffre } from '@potentiel-applications/projectors';

export const setupAppelOffre = async () => {
  await seedAppelOffre();

  registerAppelOffreQueries({
    list: listProjectionV2,
    find: findProjection,
  });
};
