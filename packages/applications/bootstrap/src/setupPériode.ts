import { mediator } from 'mediateur';

import { PériodeProjector } from '@potentiel-applications/projectors';
import { Période } from '@potentiel-domain/periode';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { loadAggregateV2, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { PériodeNotification, SendEmail } from '@potentiel-applications/notifications';

import { getProjetAggregateRootAdapter } from './adapters/getProjetAggregateRoot.adapter';

type SetupPériodeDependencies = {
  sendEmail: SendEmail;
};

export const setupPériode = async ({ sendEmail }: SetupPériodeDependencies) => {
  Période.registerPériodeQueries({
    find: findProjection,
    list: listProjection,
  });
  Période.registerPériodeUseCases({
    loadAggregate: loadAggregateV2,
    getProjetAggregateRoot: getProjetAggregateRootAdapter,
  });

  // TODO move to Subscribers

  PériodeProjector.register();
  PériodeNotification.register({ sendEmail });

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

  const unsubscribePériodeNotification = await subscribe<PériodeNotification.SubscriptionEvent>({
    name: 'notifications',
    streamCategory: 'période',
    eventType: ['PériodeNotifiée-V1'],
    eventHandler: async (event) => {
      await mediator.publish<PériodeNotification.Execute>({
        type: 'System.Notification.Période',
        data: event,
      });
    },
  });

  return async () => {
    await unsubscribePériodeProjector();
    await unsubscribePériodeNotification();
  };
};
