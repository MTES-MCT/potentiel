import { registerRéseauQueries, registerRéseauUseCases } from '@potentiel-domain/reseau';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupRéseau = () => {
  registerRéseauUseCases({
    loadAggregate: loadAggregateV2,
  });

  registerRéseauQueries({
    list: listProjection,
    find: findProjection,
  });
};
