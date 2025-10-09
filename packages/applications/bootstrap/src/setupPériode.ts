import { Période } from '@potentiel-domain/periode';
import { getProjetAggregateRootAdapter } from '@potentiel-infrastructure/domain-adapters';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';

export const setupPériode = () => {
  Période.registerPériodeQueries({
    find: findProjection,
    list: listProjection,
  });
  Période.registerPériodeUseCases({
    loadAggregate: loadAggregateV2,
    getProjetAggregateRoot: getProjetAggregateRootAdapter,
  });
};
