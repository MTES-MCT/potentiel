import { mediator } from 'mediateur';

import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { TâchePlanifiéeProjector } from '@potentiel-applications/projectors';
import { listProjection } from '@potentiel-infrastructure/pg-projections';
import {
  registerTâchePlanifiéeUseCases,
  registerTâchePlanifiéeQuery,
} from '@potentiel-domain/tache-planifiee';
import { sendEmail } from '@potentiel-infrastructure/email';
import { TâchePlanifiéeNotification } from '@potentiel-applications/notifications';

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
  TâchePlanifiéeNotification.register({ sendEmail });

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

  const unsubscribeAbandonNotification =
    await subscribe<TâchePlanifiéeNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'abandon',
      eventType: ['TâchePlanifiéeExecutée-V1'],
      eventHandler: async (event) => {
        await mediator.publish<TâchePlanifiéeNotification.Execute>({
          type: 'System.Notification.TâchePlanifiée',
          data: event,
        });
      },
    });

  return async () => {
    await unsubscribeTâcheProjector();
    await unsubscribeAbandonNotification();
  };
};
