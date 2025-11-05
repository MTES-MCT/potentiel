import { HistoriqueProjector, InstallationProjector } from '@potentiel-applications/projectors';
import { InstallationNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

export const setupInstallation: SetupProjet = async ({ sendEmail }) => {
  const installation = createSubscriptionSetup('installation');

  InstallationProjector.register();

  await installation.setupSubscription<
    InstallationProjector.SubscriptionEvent,
    InstallationProjector.Execute
  >({
    name: 'projector',
    eventType: 'all',
    messageType: 'System.Projector.Lauréat.Installation',
  });

  InstallationNotification.register({ sendEmail });
  await installation.setupSubscription<
    InstallationNotification.SubscriptionEvent,
    InstallationNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'InstallateurModifié-V1',
      'TypologieInstallationModifiée-V1',
      'DispositifDeStockageModifié-V1',
      'ChangementInstallateurEnregistré-V1',
    ],
    messageType: 'System.Notification.Lauréat.Installation',
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
