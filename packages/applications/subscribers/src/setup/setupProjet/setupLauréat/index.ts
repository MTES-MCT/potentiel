import { HistoriqueProjector, LauréatProjector } from '@potentiel-applications/projectors';
import { LauréatNotification } from '@potentiel-applications/notifications';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

import { setupPuissance } from './setupPuissance.js';
import { setupProducteur } from './setupProducteur.js';
import { setupFournisseur } from './setupFournisseur.js';
import { setupAbandon } from './setupAbandon.js';
import { setupAchèvement } from './setupAchèvement.js';
import { setupActionnaire } from './setupActionnaire.js';
import { setupReprésentantLégal } from './setupReprésentantLégal.js';
import { setupRaccordement } from './setupRaccordement.js';
import { setupDélai } from './setupDélai.js';
import { setupTâchePlanifiée } from './setupTâchePlanifiée.js';
import { setupGarantiesFinancières } from './setupGarantiesFinancière.js';
import { setupInstallation } from './setupInstallation.js';
import { setupTâche } from './setupTâche.js';
import { setupNatureDeLExploitation } from './setupNatureDeLExploitation.js';

export const setupLauréat: SetupProjet = async (dependencies) => {
  LauréatProjector.register();

  const lauréat = createSubscriptionSetup('lauréat');

  await lauréat.setupSubscription<LauréatProjector.SubscriptionEvent, LauréatProjector.Execute>({
    name: 'projector',
    eventType: [
      'LauréatNotifié-V1',
      'NomEtLocalitéLauréatImportés-V1',
      'LauréatNotifié-V2',
      'SiteDeProductionModifié-V1',
      'NomProjetModifié-V1',
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

  await lauréat.setupSubscription<
    Lauréat.Raccordement.RaccordementSaga.SubscriptionEvent,
    Lauréat.Raccordement.RaccordementSaga.Execute
  >({
    name: 'raccordement-laureat-saga',
    eventType: ['LauréatNotifié-V2'],
    messageType: 'System.Lauréat.Raccordement.Saga.Execute',
  });

  await lauréat.setupSubscription<
    Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.SubscriptionEvent,
    Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.Execute
  >({
    name: 'garanties-financieres-laureat-saga',
    eventType: ['LauréatNotifié-V2'],
    messageType: 'System.Lauréat.GarantiesFinancières.Saga.Execute',
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
  const unsetupInstallation = await setupInstallation(dependencies);
  const unsetupNatureDeLExploitation = await setupNatureDeLExploitation(dependencies);

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
    await unsetupInstallation();
    await unsetupNatureDeLExploitation();
  };
};
