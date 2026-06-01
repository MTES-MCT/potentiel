import { AccèsNotification } from '@potentiel-applications/notifications';
import { AccèsProjector } from '@potentiel-applications/projectors';
import type { UtilisateurSaga } from '@potentiel-domain/utilisateur';

import { createSubscriptionSetup } from '../createSubscriptionSetup.js';

export const setupAccès = () => {
  const accès = createSubscriptionSetup('accès');

  AccèsProjector.register();
  accès.addSubscription<AccèsProjector.SubscriptionEvent, AccèsProjector.Execute>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'AccèsProjetAutorisé-V1',
      'AccèsProjetRetiré-V1',
      'AccèsProjetRemplacé-V1',
    ],
    messageType: 'System.Projector.Accès',
  });

  AccèsNotification.register();
  accès.addSubscription<AccèsNotification.SubscriptionEvent, AccèsNotification.Execute>({
    name: 'notifications',
    eventType: ['AccèsProjetAutorisé-V1', 'AccèsProjetRetiré-V1'],
    messageType: 'System.Notification.Accès',
  });

  accès.addSubscription<UtilisateurSaga.SubscriptionEvent, UtilisateurSaga.Execute>({
    name: 'utilisateur-acces-saga',
    eventType: ['AccèsProjetAutorisé-V1', 'AccèsProjetRemplacé-V1'],
    messageType: 'System.Utilisateur.Saga.Execute',
  });

  return accès;
};
