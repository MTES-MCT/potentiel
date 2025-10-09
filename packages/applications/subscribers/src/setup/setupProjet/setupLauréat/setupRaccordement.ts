import { RaccordementProjector } from '@potentiel-applications/projectors';
import { HistoriqueProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup';
import { SetupProjet } from '../setup';

export const setupRaccordement: SetupProjet = async () => {
  const raccordement = createSubscriptionSetup('raccordement');

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
      'GestionnaireRéseauInconnuAttribué-V1',
      'PropositionTechniqueEtFinancièreModifiée-V1',
      'PropositionTechniqueEtFinancièreModifiée-V2',
      'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
      'PropositionTechniqueEtFinancièreTransmise-V1',
      'PropositionTechniqueEtFinancièreTransmise-V2',
      'RéférenceDossierRacordementModifiée-V1',
      'RéférenceDossierRacordementModifiée-V2',
      'GestionnaireRéseauAttribué-V1',
      'DossierDuRaccordementSupprimé-V1',
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
