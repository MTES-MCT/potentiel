import { registerRéseauQueries, registerRéseauUseCases } from '@potentiel-domain/reseau';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupRéseau = () => {
  registerRéseauUseCases({
    loadAggregate,
  });

  registerRéseauQueries({
    list: listProjection,
    find: findProjection,
  });
};
