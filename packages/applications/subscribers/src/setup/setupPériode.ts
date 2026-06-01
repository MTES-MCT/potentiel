import { PériodeNotification } from '@potentiel-applications/notifications';
import { PériodeProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from './createSubscriptionSetup.js';

export const setupPériode = () => {
  const période = createSubscriptionSetup('période');

  PériodeProjector.register();
  période.addSubscription<PériodeProjector.SubscriptionEvent, PériodeProjector.Execute>({
    name: 'projector',
    eventType: ['PériodeNotifiée-V1', 'RebuildTriggered'],
    messageType: 'System.Projector.Période',
  });

  PériodeNotification.register();
  période.addSubscription<PériodeNotification.SubscriptionEvent, PériodeNotification.Execute>({
    name: 'notifications',
    eventType: ['PériodeNotifiée-V1'],
    messageType: 'System.Notification.Période',
  });

  return période;
};
