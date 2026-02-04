import { HistoriqueProjector, DélaiProjector } from '@potentiel-applications/projectors';
import { DélaiNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

export const setupDélai: SetupProjet = async () => {
  const délai = createSubscriptionSetup('délai');

  DélaiProjector.registerDélaiProjectors();
  await délai.setupSubscription<DélaiProjector.SubscriptionEvent, DélaiProjector.Execute>({
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
  await délai.setupSubscription<DélaiNotification.SubscriptionEvent, DélaiNotification.Execute>({
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

  await délai.setupSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>(
    { name: 'history', eventType: 'all', messageType: 'System.Projector.Historique' },
  );

  return délai.clearSubscriptions;
};
