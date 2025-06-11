import { ÉliminéProjector } from '@potentiel-applications/projectors';

import { SetupProjet } from '../setup';
import { createSubscriptionSetup } from '../createSubscriptionSetup';

import { setupRecours } from './setupRecours';

export const setupÉliminé: SetupProjet = async (dependencies) => {
  const éliminé = createSubscriptionSetup('éliminé');

  ÉliminéProjector.register();
  await éliminé.setupSubscription<ÉliminéProjector.SubscriptionEvent, ÉliminéProjector.Execute>({
    name: 'projector',
    eventType: ['ÉliminéNotifié-V1', 'ÉliminéArchivé-V1', 'RebuildTriggered'],
    messageType: 'System.Projector.Eliminé',
  });

  const unsubscribeRecours = await setupRecours(dependencies);

  return async () => {
    await éliminé.clearListeners();
    await unsubscribeRecours();
  };
};
