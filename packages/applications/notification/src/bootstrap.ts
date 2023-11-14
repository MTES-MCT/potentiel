import { mediator } from 'mediateur';
import { subscribe, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import {
  CandidatureAdapter,
  récupérerCandidatureAdapter,
  récupérerPorteursProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';

import {
  ExecuteProjetNotification,
  registerProjetNotification,
} from './exemple/exemple.notification';
import { QuelqueChoseSestPasséEvent } from './exemple/exemple.event';
import {
  ExecuteLauréatAbandonNotification,
  registerLauréatAbandonNotification,
} from './lauréat/abandon/accorder/accorderAbandon.notification';
import { Abandon } from '@potentiel-domain/laureat';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (): Promise<UnsetupApp> => {
  registerProjetNotification({
    récupérerCandidatureLegacy: récupérerCandidatureAdapter,
    récupérerPorteursProjet: récupérerPorteursProjetAdapter,
  });

  registerLauréatAbandonNotification({
    récupérerCandidature: CandidatureAdapter.récupérerCandidatureAdapter,
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

  const unsubscribeLauréatAbandonNotifications = await subscribe<Abandon.AbandonEvent & Event>({
    name: 'notifications',
    streamCategory: 'abandon',
    eventType: ['AbandonAccordé-V1'],
    eventHandler: async (event) => {
      await mediator.publish<ExecuteLauréatAbandonNotification>({
        type: 'EXECUTE_LAUREAT_ABANDON_NOTIFICATION',
        data: event,
      });
    },
  });

  return async () => {
    await unsubscribeNotifications();
    await unsubscribeLauréatAbandonNotifications();
  };
};
