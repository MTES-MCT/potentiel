import { HistoriqueProjector, InstallationProjector } from '@potentiel-applications/projectors';
import { InstallateurNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupInstallation: SetupProjet = async ({ sendEmail }) => {
  const installation = createSubscriptionSetup('installation');

  InstallationProjector.register();

  await installation.setupSubscription<
    InstallationProjector.SubscriptionEvent,
    InstallationProjector.Execute
  >({
    name: 'projector',
    eventType: ['RebuildTriggered', 'InstallationImportée-V1', 'InstallateurModifié-V1'],
    messageType: 'System.Projector.Lauréat.Installation',
  });

  InstallateurNotification.register({ sendEmail });
  await installation.setupSubscription<
    InstallateurNotification.SubscriptionEvent,
    InstallateurNotification.Execute
  >({
    name: 'notifications',
    eventType: ['InstallateurModifié-V1'],
    messageType: 'System.Notification.Lauréat.Installateur',
  });

  await installation.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return installation.clearSubscriptions;
};
