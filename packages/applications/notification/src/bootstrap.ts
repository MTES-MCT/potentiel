import { mediator } from 'mediateur';
import { subscribe } from '@potentiel/pg-event-sourcing';
import { AbandonEvent } from '@potentiel/domain';
import {
  récupérerDétailProjetAdapter,
  récupérerPorteursProjetAdapter,
} from '@potentiel/infra-adapters';

import {
  ExecuteAbandonProjetNotification,
  registerAbandonProjetNotification,
} from './abandon/abandonAvecRecandidature.notification';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (): Promise<UnsetupApp> => {
  registerAbandonProjetNotification({
    récupérerDétailProjet: récupérerDétailProjetAdapter,
    récupérerPorteursProjet: récupérerPorteursProjetAdapter,
  });

  // Subscribes
  const unsubscribeNotifications = await subscribe<AbandonEvent>({
    name: 'notifications',
    streamCategory: 'abandon',
    eventType: ['AbandonDemandé'],
    eventHandler: async (event: AbandonEvent) => {
      await mediator.publish<ExecuteAbandonProjetNotification>({
        type: 'EXECUTE_ABANDON_PROJET_NOTIFICATION',
        data: event,
      });
    },
  });

  return unsubscribeNotifications;
};
