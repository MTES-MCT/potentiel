import { FournisseurNotification } from '@potentiel-applications/notifications';
import { FournisseurProjector, type HistoriqueProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupFournisseur = () => {
  const fournisseur = createSubscriptionSetup('fournisseur');

  FournisseurProjector.register();
  fournisseur.addSubscription<FournisseurProjector.SubscriptionEvent, FournisseurProjector.Execute>(
    {
      name: 'projector',
      eventType: 'all',
      messageType: 'System.Projector.Lauréat.Fournisseur',
    },
  );

  FournisseurNotification.register();
  fournisseur.addSubscription<
    FournisseurNotification.SubscriptionEvent,
    FournisseurNotification.Execute
  >({
    name: 'notifications',
    eventType: [
      'ÉvaluationCarboneSimplifiéeModifiée-V1',
      'ChangementFournisseurEnregistré-V1',
      'FournisseurModifié-V1',
    ],
    messageType: 'System.Notification.Lauréat.Fournisseur',
  });

  fournisseur.addSubscription<HistoriqueProjector.SubscriptionEvent, HistoriqueProjector.Execute>({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return fournisseur;
};
