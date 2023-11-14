import { registerAppelOffresQueries } from '@potentiel-domain/appel-offres';
import { listProjection } from '@potentiel-infrastructure/pg-projections';

export const setupAppelOffres = async () => {
  registerAppelOffresQueries({
    list: listProjection,
  });
};
