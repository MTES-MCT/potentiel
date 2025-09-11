import { HistoriqueProjector, InstallateurProjector } from '@potentiel-applications/projectors';
import { InstallateurNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupInstallateur: SetupProjet = async ({ sendEmail }) => {
  const installateur = createSubscriptionSetup('installateur');

  InstallateurProjector.register();

  await installateur.setupSubscription<
    InstallateurProjector.SubscriptionEvent,
    InstallateurProjector.Execute
  >({
    name: 'projector',
    eventType: ['RebuildTriggered', 'InstallateurImporté-V1', 'InstallateurModifié-V1'],
    messageType: 'System.Projector.Lauréat.Installateur',
  });

  InstallateurNotification.register({ sendEmail });
  await installateur.setupSubscription<
    InstallateurNotification.SubscriptionEvent,
    InstallateurNotification.Execute
  >({
    name: 'notifications',
    eventType: ['InstallateurModifié-V1'],
    messageType: 'System.Notification.Lauréat.Installateur',
  });

  await installateur.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return installateur.clearSubscriptions;
};
