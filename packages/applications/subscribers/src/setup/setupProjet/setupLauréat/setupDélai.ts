import { DélaiNotification } from '@potentiel-applications/notifications';
import { DélaiProjector, type HistoriqueProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupDélai = () => {
  const délai = createSubscriptionSetup('délai');

  DélaiProjector.registerDélaiProjectors();
  délai.addSubscription<DélaiProjector.SubscriptionEvent, DélaiProjector.Execute>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'DélaiDemandé-V1',
      'DemandeDélaiAnnulée-V1',
      'DemandeDélaiPasséeEnInstruction-V1',
      'DemandeDélaiRejetée-V1',
      'DélaiAccordé-V1',
      'DemandeDélaiCorrigée-V1',
      'DemandeDélaiSupprimée-V1',
    ],
    messageType: 'System.Projector.Lauréat.Délai',
  });

  DélaiNotification.registerDélaiNotifications();
  délai.addSubscription<DélaiNotification.SubscriptionEvent, DélaiNotification.Execute>({
    name: 'notifications',
    eventType: [
      'DélaiDemandé-V1',
      'DemandeDélaiAnnulée-V1',
      'DemandeDélaiPasséeEnInstruction-V1',
      'DemandeDélaiRejetée-V1',
      'DélaiAccordé-V1',
      'DemandeDélaiCorrigée-V1',
    ],
    messageType: 'System.Notification.Lauréat.Délai',
  });

  délai.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return délai;
};
