import { ÉliminéNotification } from '@potentiel-applications/notifications';
import { type HistoriqueProjector, ÉliminéProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup, mergeSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { setupRecours } from './setupRecours.js';

export const setupÉliminé = () => {
  const éliminé = createSubscriptionSetup('éliminé');

  ÉliminéProjector.register();
  éliminé.addSubscription<ÉliminéProjector.SubscriptionEvent, ÉliminéProjector.Execute>({
    name: 'projector',
    eventType: ['ÉliminéNotifié-V1', 'ÉliminéArchivé-V1', 'RebuildTriggered'],
    messageType: 'System.Projector.Eliminé',
  });

  ÉliminéNotification.register();
  éliminé.addSubscription<ÉliminéNotification.SubscriptionEvent, ÉliminéNotification.Execute>({
    name: 'notifications',
    eventType: ['ÉliminéNotifié-V1'],
    messageType: 'System.Notification.Éliminé',
  });

  éliminé.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  const recours = setupRecours();

  return mergeSubscriptionSetup(éliminé, recours);
};
