import { PowerPurchaseAgreementNotification } from '@potentiel-applications/notifications';
import {
  type HistoriqueProjector,
  PowerPurchaseAgreementProjector,
} from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupPowerPurchaseAgreement = () => {
  const powerPurchaseAgreement = createSubscriptionSetup('power-purchase-agreement');

  PowerPurchaseAgreementProjector.register();
  powerPurchaseAgreement.addSubscription<
    PowerPurchaseAgreementProjector.SubscriptionEvent,
    PowerPurchaseAgreementProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'PowerPurchaseAgreementSignalé-V1',
      'SignalementPowerPurchaseAgreementAnnulé-V1',
    ],
    messageType: 'System.Projector.Lauréat.PowerPurchaseAgreement',
  });

  PowerPurchaseAgreementNotification.register();
  powerPurchaseAgreement.addSubscription<
    PowerPurchaseAgreementNotification.SubscriptionEvent,
    PowerPurchaseAgreementNotification.Execute
  >({
    name: 'notifications',
    eventType: ['SignalementPowerPurchaseAgreementAnnulé-V1', 'PowerPurchaseAgreementSignalé-V1'],
    messageType: 'System.Notification.Lauréat.PowerPurchaseAgreement',
  });

  powerPurchaseAgreement.addSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return powerPurchaseAgreement;
};
