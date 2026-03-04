import { PériodeProjector } from '@potentiel-applications/projectors';
import { PériodeNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from './createSubscriptionSetup.js';

export const setupPériode = async () => {
  const période = createSubscriptionSetup('période');

  PériodeProjector.register();
  await période.setupSubscription<PériodeProjector.SubscriptionEvent, PériodeProjector.Execute>({
    name: 'projector',
    eventType: ['PériodeNotifiée-V1', 'RebuildTriggered'],
    messageType: 'System.Projector.Période',
  });

  PériodeNotification.register();
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
