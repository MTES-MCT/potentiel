import { FournisseurProjector, HistoriqueProjector } from '@potentiel-applications/projectors';

import { SetupProjet } from '../setup';
import { createSubscriptionSetup } from '../createSubscriptionSetup';

export const setupFournisseur: SetupProjet = async () => {
  const fournisseur = createSubscriptionSetup('fournisseur');

  FournisseurProjector.register();
  await fournisseur.setupSubscription<
    FournisseurProjector.SubscriptionEvent,
    FournisseurProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'FournisseurImporté-V1',
      'ÉvaluationCarboneSimplifiéeModifiée-V1',
    ],
    messageType: 'System.Projector.Lauréat.Fournisseur',
  });

  await fournisseur.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return fournisseur.clearListeners;
};
