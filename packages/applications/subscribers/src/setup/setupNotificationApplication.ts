import { NotificationApplicationProjector } from '@potentiel-applications/projectors';
import { NotificationApplication } from '@potentiel-domain/notifications-application';

import { createSubscriptionSetup } from './createSubscriptionSetup.js';

export const setupNotificationApplication = () => {
  const notificationApplication = createSubscriptionSetup('notification-application');

  NotificationApplication.Saga.register();

  NotificationApplicationProjector.register();
  notificationApplication.addSubscription<
    NotificationApplicationProjector.SubscriptionEvent,
    NotificationApplicationProjector.Execute
  >({
    name: 'projector',
    eventType: ['RebuildTriggered', 'NotificationApplicationAjoutée-V1'],
    messageType: 'System.Projector.NotificationApplication',
  });

  return notificationApplication;
};
