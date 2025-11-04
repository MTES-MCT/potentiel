import { UtilisateurProjector } from '@potentiel-applications/projectors';
import { SendEmail, UtilisateurNotification } from '@potentiel-applications/notifications';

import { createSubscriptionSetup } from './createSubscriptionSetup.js';

type SetupUtilisateurDependencies = {
  sendEmail: SendEmail;
};

export const setupUtilisateur = async ({ sendEmail }: SetupUtilisateurDependencies) => {
  const utilisateur = createSubscriptionSetup('utilisateur');

  UtilisateurProjector.register();
  await utilisateur.setupSubscription<
    UtilisateurProjector.SubscriptionEvent,
    UtilisateurProjector.Execute
  >({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'UtilisateurInvité-V1',
      'UtilisateurInvité-V2',
      'PorteurInvité-V1',
      'UtilisateurDésactivé-V1',
      'UtilisateurRéactivé-V1',
      'RôleUtilisateurModifié-V1',
    ],
    messageType: 'System.Projector.Utilisateur',
  });

  UtilisateurNotification.register({ sendEmail });

  await utilisateur.setupSubscription<
    UtilisateurNotification.SubscriptionEvent,
    UtilisateurNotification.Execute
  >({
    name: 'notifications',
    eventType: ['PorteurInvité-V1', 'UtilisateurInvité-V2'],
    messageType: 'System.Notification.Utilisateur',
  });

  return utilisateur.clearSubscriptions;
};
