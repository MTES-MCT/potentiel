import { PériodeProjector } from '@potentiel-applications/projectors';
import { Période } from '@potentiel-domain/periode';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';
import { PériodeNotification, SendEmail } from '@potentiel-applications/notifications';

import { getProjetAggregateRootAdapter } from './adapters/getProjetAggregateRoot.adapter';
import { createSubscriptionSetup } from './createSubscriptionSetup';

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

  const période = createSubscriptionSetup('période');

  PériodeProjector.register();
  await période.setupSubscription<PériodeProjector.SubscriptionEvent, PériodeProjector.Execute>({
    name: 'projector',
    eventType: ['PériodeNotifiée-V1', 'RebuildTriggered'],
    messageType: 'System.Projector.Période',
  });

  PériodeNotification.register({ sendEmail });
  await période.setupSubscription<
    PériodeNotification.SubscriptionEvent,
    PériodeNotification.Execute
  >({
    name: 'notifications',
    eventType: ['PériodeNotifiée-V1'],
    messageType: 'System.Notification.Période',
  });

  return période.clearSubscriptions;
};
