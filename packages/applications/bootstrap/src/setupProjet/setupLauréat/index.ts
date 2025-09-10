import { HistoriqueProjector, LauréatProjector } from '@potentiel-applications/projectors';
import { LauréatNotification } from '@potentiel-applications/notifications';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../createSubscriptionSetup';
import { SetupProjet } from '../setup';

import { setupPuissance } from './setupPuissance';
import { setupProducteur } from './setupProducteur';
import { setupFournisseur } from './setupFournisseur';
import { setupAbandon } from './setupAbandon';
import { setupAchèvement } from './setupAchèvement';
import { setupActionnaire } from './setupActionnaire';
import { setupReprésentantLégal } from './setupReprésentantLégal';
import { setupRaccordement } from './setupRaccordement';
import { setupDélai } from './setupDélai';
import { setupTâchePlanifiée } from './setupTâchePlanifiée';
import { setupGarantiesFinancières } from './setupGarantiesFinancière';
import { setupInstallateur } from './setupInstallateur';
import { setupTâche } from './setupTâche';

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

  Lauréat.Raccordement.RaccordementSaga.register(dependencies);

  await lauréat.setupSubscription<
    Lauréat.Raccordement.RaccordementSaga.SubscriptionEvent,
    Lauréat.Raccordement.RaccordementSaga.Execute
  >({
    name: 'raccordement-laureat-saga',
    eventType: ['LauréatNotifié-V2'],
    messageType: 'System.Lauréat.Raccordement.Saga.Execute',
  });

  const unsetupPuissance = await setupPuissance(dependencies);
  const unsetupProducteur = await setupProducteur(dependencies);
  const unsetupFournisseur = await setupFournisseur(dependencies);
  const unsetupAchèvement = await setupAchèvement(dependencies);
  const unsetupAbandon = await setupAbandon(dependencies);
  const unsetupActionnaire = await setupActionnaire(dependencies);
  const unsetupReprésentantLégal = await setupReprésentantLégal(dependencies);
  const unsetupRaccordement = await setupRaccordement(dependencies);
  const unsetupDélai = await setupDélai(dependencies);
  const unsetupGarantiesFinancières = await setupGarantiesFinancières(dependencies);
  const unsetupTâchePlanifiée = await setupTâchePlanifiée(dependencies);
  const unsetupTâche = await setupTâche();
  const unsetupInstallateur = await setupInstallateur(dependencies);

  return async () => {
    await lauréat.clearSubscriptions();

    await unsetupPuissance();
    await unsetupProducteur();
    await unsetupFournisseur();
    await unsetupAchèvement();
    await unsetupAbandon();
    await unsetupActionnaire();
    await unsetupReprésentantLégal();
    await unsetupRaccordement();
    await unsetupDélai();
    await unsetupGarantiesFinancières();
    await unsetupTâchePlanifiée();
    await unsetupTâche();
    await unsetupInstallateur();
  };
};
