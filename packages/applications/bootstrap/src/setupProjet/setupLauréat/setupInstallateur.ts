import { InstallateurProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupInstallateur: SetupProjet = async () => {
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

  return installateur.clearSubscriptions;
};
