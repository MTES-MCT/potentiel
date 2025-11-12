import { AccèsProjector } from '@potentiel-applications/projectors';
import { AccèsNotification } from '@potentiel-applications/notifications';
import { UtilisateurSaga } from '@potentiel-domain/utilisateur';

import { createSubscriptionSetup } from '../createSubscriptionSetup.js';

import { SetupProjet } from './setup.js';

export const setupAccès: SetupProjet = async ({ sendEmail }) => {
  const accès = createSubscriptionSetup('accès');

  AccèsProjector.register();
  await accès.setupSubscription<AccèsProjector.SubscriptionEvent, AccèsProjector.Execute>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'AccèsProjetAutorisé-V1',
      'AccèsProjetRetiré-V1',
      'AccèsProjetRemplacé-V1',
    ],
    messageType: 'System.Projector.Accès',
  });

  AccèsNotification.register({ sendEmail });
  await accès.setupSubscription<AccèsNotification.SubscriptionEvent, AccèsNotification.Execute>({
    name: 'notifications',
    eventType: ['AccèsProjetAutorisé-V1', 'AccèsProjetRetiré-V1'],
    messageType: 'System.Notification.Accès',
  });

  await accès.setupSubscription<UtilisateurSaga.SubscriptionEvent, UtilisateurSaga.Execute>({
    name: 'utilisateur-acces-saga',
    eventType: ['AccèsProjetAutorisé-V1', 'AccèsProjetRemplacé-V1'],
    messageType: 'System.Utilisateur.Saga.Execute',
  });

  return accès.clearSubscriptions;
};
