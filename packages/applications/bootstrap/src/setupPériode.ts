import { mediator } from 'mediateur';

import { PériodeProjector } from '@potentiel-applications/projectors';
import { Période } from '@potentiel-domain/periode';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';

export const setupPériode = async () => {
  Période.registerPériodeQueries({
    find: findProjection,
  });
  Période.registerPériodeUseCases({ loadAggregate });

  PériodeProjector.register();

  const unsubscribePériodeProjector = await subscribe<PériodeProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: ['PériodeNotifiée-V1', 'RebuildTriggered'],
    eventHandler: async (event) => {
      await mediator.send<PériodeProjector.Execute>({
        type: 'System.Projector.Periode',
        data: event,
      });
    },
    streamCategory: 'période',
  });

  return async () => {
    await unsubscribePériodeProjector();
  };
};
