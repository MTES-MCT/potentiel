import { registerAppelOffreQueries } from '@potentiel-domain/appel-offre';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projections';

export const setupAppelOffre = async () => {
  registerAppelOffreQueries({
    list: listProjection,
    find: findProjection,
  });
};
