import { AppelOffre } from '@potentiel-domain/appel-offre';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupAppelOffre = () => {
  AppelOffre.registerAppelOffreQueries({
    list: listProjection,
    find: findProjection,
  });
};
