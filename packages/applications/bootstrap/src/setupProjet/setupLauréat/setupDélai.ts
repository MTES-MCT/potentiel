import { HistoriqueProjector, DélaiProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupDélai: SetupProjet = async () => {
  const délai = createSubscriptionSetup('délai');

  DélaiProjector.registerDélaiProjectors();
  await délai.setupSubscription<DélaiProjector.SubscriptionEvent, DélaiProjector.Execute>({
    name: 'projector',
    eventType: ['RebuildTriggered', 'DélaiDemandé-V1', 'DélaiAccordé-V1'],
    messageType: 'System.Projector.Lauréat.Délai',
  });

  await délai.setupSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>(
    {
      name: 'history',
      eventType: 'all',
      messageType: 'System.Projector.Historique',
    },
  );

  return délai.clearSubscriptions;
};
