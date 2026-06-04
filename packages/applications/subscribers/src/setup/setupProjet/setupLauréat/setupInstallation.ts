import { InstallationNotification } from '@potentiel-applications/notifications';
import {
  type HistoriqueProjector,
  InstallationProjector,
} from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupInstallation = () => {
  const installation = createSubscriptionSetup('installation');

  InstallationProjector.register();

  installation.addSubscription<
    InstallationProjector.SubscriptionEvent,
    InstallationProjector.Execute
  >({
    name: 'projector',
    eventType: 'all',
    messageType: 'System.Projector.Lauréat.Installation',
  });

  InstallationNotification.register();
  installation.addSubscription<
    InstallationNotification.SubscriptionEvent,
    InstallationNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'InstallateurModifié-V1',
      'TypologieInstallationModifiée-V1',
      'DispositifDeStockageModifié-V1',
      'ChangementInstallateurEnregistré-V1',
      'ChangementDispositifDeStockageEnregistré-V1',
    ],
    messageType: 'System.Notification.Lauréat.Installation',
  });

  installation.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return installation;
};
