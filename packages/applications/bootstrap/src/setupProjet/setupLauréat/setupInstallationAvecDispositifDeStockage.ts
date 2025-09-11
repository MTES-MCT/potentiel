import { InstallationAvecDispositifDeStockageProjector } from '@potentiel-applications/projectors';
import { InstallationAvecDispositifDeStockageNotifications } from '@potentiel-applications/notifications';

import { SetupProjet } from '../setup';
import { createSubscriptionSetup } from '../createSubscriptionSetup';

export const setupInstallationAvecDispositifDeStockage: SetupProjet = async ({ sendEmail }) => {
  const installationAvecDispositifDeStockage = createSubscriptionSetup(
    'installation-avec-dispositif-de-stockage',
  );

  InstallationAvecDispositifDeStockageProjector.register();

  await installationAvecDispositifDeStockage.setupSubscription<
    InstallationAvecDispositifDeStockageProjector.SubscriptionEvent,
    InstallationAvecDispositifDeStockageProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'InstallationAvecDispositifDeStockageImportée-V1',
      'InstallationAvecDispositifDeStockageModifiée-V1',
    ],
    messageType: 'System.Projector.Lauréat.InstallationAvecDispositifDeStockage',
  });

  InstallationAvecDispositifDeStockageNotifications.register({ sendEmail });

  await installationAvecDispositifDeStockage.setupSubscription<
    InstallationAvecDispositifDeStockageNotifications.SubscriptionEvent,
    InstallationAvecDispositifDeStockageNotifications.Execute
  >({
    name: 'notifications',
    eventType: ['InstallationAvecDispositifDeStockageModifiée-V1'],
    messageType: 'System.Notification.Lauréat.InstallationAvecDispositifDeStockage',
  });

  return installationAvecDispositifDeStockage.clearSubscriptions;
};
