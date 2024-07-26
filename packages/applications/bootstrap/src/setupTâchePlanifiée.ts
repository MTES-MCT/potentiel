import { mediator } from 'mediateur';

import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâchePlanifiéeProjector } from '@potentiel-applications/projectors';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  registerTâchePlanifiéeUseCases,
  registerTâchePlanifiéeQuery,
} from '@potentiel-domain/tache-planifiee';

export const setupTâchePlanifiée = async () => {
  const unsubscribeTâchePlanifiéeProjector = await registerTâchePlanifiéeProjector();

  return async () => {
    await unsubscribeTâchePlanifiéeProjector();
  };
};

const registerTâchePlanifiéeProjector = async () => {
  registerTâchePlanifiéeUseCases({
    loadAggregate,
  });

  registerTâchePlanifiéeQuery({
    list: listProjection,
  });
  TâchePlanifiéeProjector.register();

  const unsubscribeTâcheProjector = await subscribe<TâchePlanifiéeProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'TâchePlanifiéeAjoutée-V1',
      'TâchePlanifiéeAnnulée-V1',
      'TâchePlanifiéeExecutée-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<TâchePlanifiéeProjector.Execute>({
        type: 'System.Projector.TâchePlanifiée',
        data: event,
      });
    },
    streamCategory: 'tâche-planifiée',
  });
  return unsubscribeTâcheProjector;
};
