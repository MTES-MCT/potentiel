import { HistoriqueProjector, LauréatProjector } from '@potentiel-applications/projectors';
import { LauréatNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
import { SetupProjet } from '../setup';

import { setupPuissance } from './setupPuissance';
import { setupProducteur } from './setupProducteur';
import { setupFournisseur } from './setupFournisseur';
import { setupAbandon } from './setupAbandon';
import { setupAchèvement } from './setupAchèvement';

export const setupLauréat: SetupProjet = async (dependencies) => {
  LauréatProjector.register();

  const lauréat = createSubscriptionSetup('lauréat');

  await lauréat.setupSubscription<LauréatProjector.SubscriptionEvent, LauréatProjector.Execute>({
    name: 'projector',
    eventType: [
      'LauréatNotifié-V1',
      'NomEtLocalitéLauréatImportés-V1',
      'LauréatNotifié-V2',
      'LauréatModifié-V1',
      'CahierDesChargesChoisi-V1',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Lauréat',
  });

  LauréatNotification.register(dependencies);
  await lauréat.setupSubscription<
    LauréatNotification.SubscriptionEvent,
    LauréatNotification.Execute
  >({
    name: 'notifications',
    eventType: ['CahierDesChargesChoisi-V1'],
    messageType: 'System.Notification.Lauréat',
  });

  await lauréat.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  const unsetupPuissance = await setupPuissance(dependencies);
  const unsetupProducteur = await setupProducteur(dependencies);
  const unsetupFournisseur = await setupFournisseur(dependencies);
  const unsetupAchèvement = await setupAchèvement(dependencies);
  const unsetupAbandon = await setupAbandon(dependencies);

  return async () => {
    await lauréat.clearListeners();

    await unsetupPuissance();
    await unsetupProducteur();
    await unsetupFournisseur();
    await unsetupAchèvement();
    await unsetupAbandon();
  };
};
