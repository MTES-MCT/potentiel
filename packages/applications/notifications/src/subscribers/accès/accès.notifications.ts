import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Accès } from '@potentiel-domain/projet';

import {
  handleAccèsProjetRetiré,
  handleAccèsProjetAutoriséSuiteÀRéclamation,
} from './handlers/index.js';

export type SubscriptionEvent = Accès.AccèsEvent;

export type Execute = Message<'System.Notification.Accès', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'AccèsProjetRetiré-V1' }, handleAccèsProjetRetiré)
      .with(
        {
          type: 'AccèsProjetAutorisé-V1',
          payload: {
            raison: 'réclamation',
          },
        },
        handleAccèsProjetAutoriséSuiteÀRéclamation,
      )
      .otherwise(() => Promise.resolve());

  mediator.register('System.Notification.Accès', handler);
};
