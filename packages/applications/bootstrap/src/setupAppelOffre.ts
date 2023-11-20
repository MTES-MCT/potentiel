import { registerAppelOffreQueries } from '@potentiel-domain/appel-offre';
import { listProjection } from '@potentiel-infrastructure/pg-projections';

export const setupAppelOffre = async () => {
  registerAppelOffreQueries({
    list: listProjection,
  });
};
