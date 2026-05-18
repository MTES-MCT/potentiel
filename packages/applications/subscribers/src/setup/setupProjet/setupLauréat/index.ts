import { LauréatNotification } from '@potentiel-applications/notifications';
import { type HistoriqueProjector, LauréatProjector } from '@potentiel-applications/projectors';
import type { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import type { SetupProjet } from '../setup.js';
import { setupAbandon } from './setupAbandon.js';
import { setupAchèvement } from './setupAchèvement.js';
import { setupActionnaire } from './setupActionnaire.js';
import { setupDélai } from './setupDélai.js';
import { setupFournisseur } from './setupFournisseur.js';
import { setupGarantiesFinancières } from './setupGarantiesFinancière.js';
import { setupInstallation } from './setupInstallation.js';
import { setupNatureDeLExploitation } from './setupNatureDeLExploitation.js';
import { setupPowerPurchaseAgreement } from './setupPowerPurchaseAgreement.js';
import { setupProducteur } from './setupProducteur.js';
import { setupPuissance } from './setupPuissance.js';
import { setupRaccordement } from './setupRaccordement.js';
import { setupReprésentantLégal } from './setupReprésentantLégal.js';
import { setupTâche } from './setupTâche.js';
import { setupTâchePlanifiée } from './setupTâchePlanifiée.js';

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
      'ChangementNomProjetEnregistré-V1',
      'StatutLauréatModifié-V1',
      'RebuildTriggered',
    ],
    messageType: 'System.Projector.Lauréat',
  });

  LauréatNotification.register();
  await lauréat.setupSubscription<
    LauréatNotification.SubscriptionEvent,
    LauréatNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'LauréatNotifié-V2',
      'ChangementNomProjetEnregistré-V1',
      'CahierDesChargesChoisi-V1',
      'NomProjetModifié-V1',
      'SiteDeProductionModifié-V1',
    ],
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

  const unsetupPuissance = await setupPuissance();
  const unsetupProducteur = await setupProducteur();
  const unsetupFournisseur = await setupFournisseur();
  const unsetupAchèvement = await setupAchèvement();
  const unsetupAbandon = await setupAbandon();
  const unsetupActionnaire = await setupActionnaire();
  const unsetupReprésentantLégal = await setupReprésentantLégal();
  const unsetupRaccordement = await setupRaccordement(dependencies);
  const unsetupDélai = await setupDélai();
  const unsetupGarantiesFinancières = await setupGarantiesFinancières(dependencies);
  const unsetupTâchePlanifiée = await setupTâchePlanifiée();
  const unsetupTâche = await setupTâche();
  const unsetupInstallation = await setupInstallation();
  const unsetupNatureDeLExploitation = await setupNatureDeLExploitation();
  const unsetupPowerPurchaseAgreement = await setupPowerPurchaseAgreement();

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
    await unsetupPowerPurchaseAgreement();
  };
};
