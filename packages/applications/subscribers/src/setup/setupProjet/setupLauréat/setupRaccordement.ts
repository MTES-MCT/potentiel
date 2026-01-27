import { RaccordementProjector } from '@potentiel-applications/projectors';
import { HistoriqueProjector } from '@potentiel-applications/projectors';
import { Lauréat } from '@potentiel-domain/projet';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';
import { SetupProjet } from '../setup.js';

export const setupRaccordement: SetupProjet = async (dependencies) => {
  const raccordement = createSubscriptionSetup('raccordement');

  Lauréat.Raccordement.RaccordementSaga.register(dependencies);

  RaccordementProjector.register();

  await raccordement.setupSubscription<
    RaccordementProjector.SubscriptionEvent,
    RaccordementProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
      'DateMiseEnServiceTransmise-V1',
      'DateMiseEnServiceTransmise-V2',
      'DemandeComplèteDeRaccordementTransmise-V1',
      'DemandeComplèteDeRaccordementTransmise-V2',
      'DemandeComplèteDeRaccordementTransmise-V3',
      'DemandeComplèteRaccordementModifiée-V1',
      'DemandeComplèteRaccordementModifiée-V2',
      'DemandeComplèteRaccordementModifiée-V3',
      'GestionnaireRéseauRaccordementModifié-V1',
      'GestionnaireRéseauRaccordementModifié-V2',
      'GestionnaireRéseauInconnuAttribué-V1',
      'PropositionTechniqueEtFinancièreModifiée-V1',
      'PropositionTechniqueEtFinancièreModifiée-V2',
      'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
      'PropositionTechniqueEtFinancièreTransmise-V1',
      'PropositionTechniqueEtFinancièreTransmise-V2',
      'PropositionTechniqueEtFinancièreTransmise-V3',
      'RéférenceDossierRacordementModifiée-V1',
      'RéférenceDossierRacordementModifiée-V2',
      'GestionnaireRéseauAttribué-V1',
      'DossierDuRaccordementSupprimé-V1',
      'DossierDuRaccordementSupprimé-V2',
      'DateMiseEnServiceSupprimée-V1',
      'RaccordementSupprimé-V1',
    ],
    messageType: 'System.Projector.Lauréat.Raccordement',
  });

  await raccordement.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return raccordement.clearSubscriptions;
};
