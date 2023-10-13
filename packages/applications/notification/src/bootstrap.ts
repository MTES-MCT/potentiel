import { mediator } from 'mediateur';
import { subscribe } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  récupérerCandidatureAdapter,
  récupérerPorteursProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';

import {
  ExecuteProjetNotification,
  registerProjetNotification,
} from './exemple/exemple.notification';
import { QuelqueChoseSestPasséEvent } from './exemple/exemple.event';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (): Promise<UnsetupApp> => {
  registerProjetNotification({
    récupérerCandidatureLegacy: récupérerCandidatureAdapter,
    récupérerPorteursProjet: récupérerPorteursProjetAdapter,
  });

  // Subscribes
  const unsubscribeNotifications = await subscribe<QuelqueChoseSestPasséEvent>({
    name: 'notifications',
    streamCategory: 'projet',
    eventType: ['QuelqueChoseSestPassé'],
    eventHandler: async (event: QuelqueChoseSestPasséEvent) => {
      await mediator.publish<ExecuteProjetNotification>({
        type: 'EXECUTE_PROJET_NOTIFICATION',
        data: event,
      });
    },
  });

  return unsubscribeNotifications;
};
