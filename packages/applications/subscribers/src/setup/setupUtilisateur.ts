import { UtilisateurNotification } from '@potentiel-applications/notifications';
import { UtilisateurProjector } from '@potentiel-applications/projectors';

import { createSubscriptionSetup } from './createSubscriptionSetup.js';

export const setupUtilisateur = () => {
  const utilisateur = createSubscriptionSetup('utilisateur');

  UtilisateurProjector.register();
  utilisateur.addSubscription<UtilisateurProjector.SubscriptionEvent, UtilisateurProjector.Execute>(
    {
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
    },
  );

  UtilisateurNotification.register();

  utilisateur.addSubscription<
    UtilisateurNotification.SubscriptionEvent,
    UtilisateurNotification.Execute
  >({
    name: 'notifications',
    eventType: ['PorteurInvité-V1', 'UtilisateurInvité-V2', 'RôleUtilisateurModifié-V1'],
    messageType: 'System.Notification.Utilisateur',
  });

  return utilisateur;
};
