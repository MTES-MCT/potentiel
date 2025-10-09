import { TâcheProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupTâche = async () => {
  const tâche = createSubscriptionSetup('tâche');

  TâcheProjector.register();
  await tâche.setupSubscription<TâcheProjector.SubscriptionEvent, TâcheProjector.Execute>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'TâcheAchevée-V1',
      'TâcheAjoutée-V1',
      'TâcheRelancée-V1',
      'TâcheRenouvellée-V1',
    ],
    messageType: 'System.Projector.Tâche',
  });
  return tâche.clearSubscriptions;
};
