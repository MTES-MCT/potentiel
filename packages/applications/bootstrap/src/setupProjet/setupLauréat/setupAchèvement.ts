import { AchèvementProjector, HistoriqueProjector } from '@potentiel-applications/projectors';
import { AchèvementNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupAchèvement: SetupProjet = async ({ sendEmail }) => {
  const achèvement = createSubscriptionSetup('achevement');

  AchèvementProjector.register();
  await achèvement.setupSubscription<
    AchèvementProjector.SubscriptionEvent,
    AchèvementProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'AttestationConformitéTransmise-V1',
      'AttestationConformitéModifiée-V1',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Lauréat.Achèvement',
  });

  AchèvementNotification.register({ sendEmail });
  await achèvement.setupSubscription<
    AchèvementNotification.SubscriptionEvent,
    AchèvementNotification.Execute
  >({
    name: 'notifications',
    eventType: ['AttestationConformitéTransmise-V1'],
    messageType: 'System.Notification.Lauréat.Achèvement.AttestationConformité',
  });

  await achèvement.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return achèvement.clearListeners;
};
