import { InstallationAvecDispositifDeStockageProjector } from '@potentiel-applications/projectors';

import { SetupProjet } from '../setup';
import { createSubscriptionSetup } from '../createSubscriptionSetup';

export const setupInstallationAvecDispositifDeStockage: SetupProjet = async () => {
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
      'InstallationAvecDispositifDeStockageImporté-V1',
      'InstallationAvecDispositifDeStockageModifié-V1',
    ],
    messageType: 'System.Projector.Lauréat.InstallationAvecDispositifDeStockage',
  });

  return installationAvecDispositifDeStockage.clearSubscriptions;
};
