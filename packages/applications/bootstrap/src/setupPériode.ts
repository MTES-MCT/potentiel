import { Période } from '@potentiel-domain/periode';
import { findProjection } from '@potentiel-infrastructure/pg-projections';

export const setupPériode = async () => {
  Période.registerPériodeQueries({
    find: findProjection,
  });
  Période.registerPériodeUseCases();
};
