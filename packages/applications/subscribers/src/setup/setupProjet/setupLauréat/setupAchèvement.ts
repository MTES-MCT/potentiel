import { AchèvementProjector, HistoriqueProjector } from '@potentiel-applications/projectors';
import { AchèvementNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

export const setupAchèvement: SetupProjet = async () => {
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
      'DateAchèvementPrévisionnelCalculée-V1',
      'DateAchèvementTransmise-V1',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Lauréat.Achèvement',
  });

  AchèvementNotification.register();
  await achèvement.setupSubscription<
    AchèvementNotification.SubscriptionEvent,
    AchèvementNotification.Execute
  >({
    name: 'notifications',
    eventType: ['AttestationConformitéTransmise-V1', 'DateAchèvementTransmise-V1'],
    messageType: 'System.Notification.Lauréat.Achèvement',
  });

  await achèvement.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return achèvement.clearSubscriptions;
};
