import { AchèvementNotification } from '@potentiel-applications/notifications';
import { AchèvementProjector, type HistoriqueProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupAchèvement = () => {
  const achèvement = createSubscriptionSetup('achevement');

  AchèvementProjector.register();
  achèvement.addSubscription<AchèvementProjector.SubscriptionEvent, AchèvementProjector.Execute>({
    name: 'projector',
    eventType: [
      'AttestationConformitéTransmise-V1',
      'AttestationConformitéTransmise-V2',
      'AttestationConformitéModifiée-V1',
      'AttestationConformitéModifiée-V2',
      'AchèvementModifié-V1',
      'AchèvementModifié-V2',
      'DateAchèvementPrévisionnelCalculée-V1',
      'DateAchèvementTransmise-V1',
      'DateAchèvementCorrigée-V1',
      'AttestationConformitéEnregistrée-V1',
      'AttestationConformitéEnregistrée-V2',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Lauréat.Achèvement',
  });

  AchèvementNotification.register();
  achèvement.addSubscription<
    AchèvementNotification.SubscriptionEvent,
    AchèvementNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'DateAchèvementTransmise-V1',
      'AttestationConformitéTransmise-V2',
      'AttestationConformitéModifiée-V2',
      'AchèvementModifié-V2',
    ],
    messageType: 'System.Notification.Lauréat.Achèvement',
  });

  achèvement.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return achèvement;
};
