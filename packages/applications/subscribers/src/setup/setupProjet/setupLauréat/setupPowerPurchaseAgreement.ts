import { PowerPurchaseAgreementProjector } from '@potentiel-applications/projectors';

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
      'PowerPurchaseAgreementAnnulé-V1',
    ],
    messageType: 'System.Projector.Lauréat.PowerPurchaseAgreement',
  });

  // TODO: notification, dans une autre carte
  // PowerPurchaseAgreementNotification.register();
  // await powerPurchaseAgreement.setupSubscription<
  //   PowerPurchaseAgreementNotification.SubscriptionEvent,
  //   PowerPurchaseAgreementNotification.Execute
  // >({
  //   name: 'notifications',
  //   eventType: [
  //     'PowerPurchaseAgreementSignalé-V1',
  //   ],
  //   messageType: 'System.Notification.Lauréat.PowerPurchaseAgreement',
  // });

  return powerPurchaseAgreement.clearSubscriptions;
};
