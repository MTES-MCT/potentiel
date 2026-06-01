import { LauréatNotification } from '@potentiel-applications/notifications';
import { type HistoriqueProjector, LauréatProjector } from '@potentiel-applications/projectors';
import type { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup, mergeSubscriptionSetup } from '../../createSubscriptionSetup.js';
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

export const setupLauréat: SetupProjet = (dependencies) => {
  LauréatProjector.register();

  const lauréat = createSubscriptionSetup('lauréat');

  lauréat.addSubscription<LauréatProjector.SubscriptionEvent, LauréatProjector.Execute>({
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
  lauréat.addSubscription<LauréatNotification.SubscriptionEvent, LauréatNotification.Execute>({
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

  lauréat.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  lauréat.addSubscription<
    Lauréat.Raccordement.RaccordementSaga.SubscriptionEvent,
    Lauréat.Raccordement.RaccordementSaga.Execute
  >({
    name: 'raccordement-laureat-saga',
    eventType: ['LauréatNotifié-V2'],
    messageType: 'System.Lauréat.Raccordement.Saga.Execute',
  });

  lauréat.addSubscription<
    Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.SubscriptionEvent,
    Lauréat.GarantiesFinancières.GarantiesFinancièresSaga.Execute
  >({
    name: 'garanties-financieres-laureat-saga',
    eventType: ['LauréatNotifié-V2'],
    messageType: 'System.Lauréat.GarantiesFinancières.Saga.Execute',
  });

  const puissance = setupPuissance();
  const producteur = setupProducteur();
  const fournisseur = setupFournisseur();
  const achèvement = setupAchèvement();
  const abandon = setupAbandon();
  const actionnaire = setupActionnaire();
  const représentantLégal = setupReprésentantLégal();
  const raccordement = setupRaccordement(dependencies);
  const délai = setupDélai();
  const garantiesFinancières = setupGarantiesFinancières(dependencies);
  const tâchePlanifiée = setupTâchePlanifiée();
  const tâche = setupTâche();
  const installation = setupInstallation();
  const natureDeLExploitation = setupNatureDeLExploitation();
  const powerPurchaseAgreement = setupPowerPurchaseAgreement();

  return mergeSubscriptionSetup(
    lauréat,
    puissance,
    producteur,
    fournisseur,
    achèvement,
    abandon,
    actionnaire,
    représentantLégal,
    raccordement,
    délai,
    garantiesFinancières,
    tâchePlanifiée,
    tâche,
    installation,
    natureDeLExploitation,
    powerPurchaseAgreement,
  );
};
