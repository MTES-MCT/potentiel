import { PériodeProjector } from '@potentiel-applications/projectors';
import { PériodeNotification, SendEmail } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from './createSubscriptionSetup.js';

type SetupPériodeDependencies = {
  sendEmail: SendEmail;
};

export const setupPériode = async ({ sendEmail }: SetupPériodeDependencies) => {
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
