import { mediator } from 'mediateur';

import {
  registerUtilisateurQueries,
  registerUtilisateurUseCases,
} from '@potentiel-domain/utilisateur';
import { loadAggregate, subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { UtilisateurProjector } from '@potentiel-applications/projectors';
import { SendEmail, UtilisateurNotification } from '@potentiel-applications/notifications';

type SetupUtilisateurDependencies = {
  sendEmail: SendEmail;
};

export const setupUtilisateur = async ({ sendEmail }: SetupUtilisateurDependencies) => {
  registerUtilisateurQueries({
    find: findProjection,
    list: listProjection,
  });

  registerUtilisateurUseCases({
    loadAggregate,
  });

  // TODO move to Subscribers

  UtilisateurProjector.register();
  UtilisateurNotification.register({ sendEmail });

  const unsubscribeUtilisateurProjector = await subscribe<UtilisateurProjector.SubscriptionEvent>({
    name: 'projector',
    eventType: [
      'RebuildTriggered',
      'UtilisateurInvité-V1',
      'PorteurInvité-V1',
      'UtilisateurDésactivé-V1',
      'UtilisateurRéactivé-V1',
    ],
    eventHandler: async (event) => {
      await mediator.send<UtilisateurProjector.Execute>({
        type: 'System.Projector.Utilisateur',
        data: event,
      });
    },
    streamCategory: 'utilisateur',
  });

  const unsubscribeUtilisateurNotification =
    await subscribe<UtilisateurNotification.SubscriptionEvent>({
      name: 'notifications',
      streamCategory: 'utilisateur',
      eventType: ['PorteurInvité-V1', 'UtilisateurInvité-V1'],
      eventHandler: async (event) => {
        await mediator.publish<UtilisateurNotification.Execute>({
          type: 'System.Notification.Utilisateur',
          data: event,
        });
      },
    });

  return async () => {
    await unsubscribeUtilisateurProjector();
    await unsubscribeUtilisateurNotification();
  };
};
