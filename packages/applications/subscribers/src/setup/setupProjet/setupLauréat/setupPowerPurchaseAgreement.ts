import {
  HistoriqueProjector,
  PowerPurchaseAgreementProjector,
} from '@potentiel-applications/projectors';
import { PowerPurchaseAgreementNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupPowerPurchaseAgreement = async () => {
  const powerPurchaseAgreement = createSubscriptionSetup('power-purchase-agreement');

  PowerPurchaseAgreementProjector.register();
  await powerPurchaseAgreement.setupSubscription<
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
  await powerPurchaseAgreement.setupSubscription<
    PowerPurchaseAgreementNotification.SubscriptionEvent,
    PowerPurchaseAgreementNotification.Execute
  >({
    name: 'notifications',
    eventType: ['SignalementPowerPurchaseAgreementAnnulé-V1', 'PowerPurchaseAgreementSignalé-V1'],
    messageType: 'System.Notification.Lauréat.PowerPurchaseAgreement',
  });

  await powerPurchaseAgreement.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return powerPurchaseAgreement.clearSubscriptions;
};
