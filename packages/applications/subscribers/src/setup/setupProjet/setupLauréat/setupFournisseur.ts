import { FournisseurProjector, HistoriqueProjector } from '@potentiel-applications/projectors';
import { FournisseurNotification } from '@potentiel-applications/notifications';

import { SetupProjet } from '../setup.js';
import { createSubscriptionSetup } from '../../createSubscriptionSetup.js';

export const setupFournisseur: SetupProjet = async ({ sendEmail }) => {
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
      'ChangementFournisseurEnregistré-V1',
    ],
    messageType: 'System.Projector.Lauréat.Fournisseur',
  });

  FournisseurNotification.register({ sendEmail });
  await fournisseur.setupSubscription<
    FournisseurNotification.SubscriptionEvent,
    FournisseurNotification.Execute
  >({
    name: 'notifications',
    eventType: ['ÉvaluationCarboneSimplifiéeModifiée-V1', 'ChangementFournisseurEnregistré-V1'],
    messageType: 'System.Notification.Lauréat.Fournisseur',
  });

  await fournisseur.setupSubscription<
    HistoriqueProjector.SubscriptionEvent,
    HistoriqueProjector.Execute
  >({
    name: 'history',
    eventType: 'all',
    messageType: 'System.Projector.Historique',
  });

  return fournisseur.clearSubscriptions;
};
