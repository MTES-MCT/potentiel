import { HistoriqueProjector, ÉliminéProjector } from '@potentiel-applications/projectors';
import { ÉliminéNotification } from '@potentiel-applications/notifications';

import { SetupProjet } from '../setup.js';
import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

import { setupRecours } from './setupRecours.js';

export const setupÉliminé: SetupProjet = async (dependencies) => {
  const éliminé = createSubscriptionSetup('éliminé');

  ÉliminéProjector.register();
  await éliminé.setupSubscription<ÉliminéProjector.SubscriptionEvent, ÉliminéProjector.Execute>({
    name: 'projector',
    eventType: ['ÉliminéNotifié-V1', 'ÉliminéArchivé-V1', 'RebuildTriggered'],
    messageType: 'System.Projector.Eliminé',
  });

  ÉliminéNotification.register(dependencies);
  await éliminé.setupSubscription<
    ÉliminéNotification.SubscriptionEvent,
    ÉliminéNotification.Execute
  >({
    name: 'notifications',
    eventType: ['ÉliminéNotifié-V1'],
    messageType: 'System.Notification.Éliminé',
  });

  await éliminé.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  const unsubscribeRecours = await setupRecours(dependencies);

  return async () => {
    await éliminé.clearSubscriptions();
    await unsubscribeRecours();
  };
};
