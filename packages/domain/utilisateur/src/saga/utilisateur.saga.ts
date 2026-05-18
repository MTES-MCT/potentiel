import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import {
  type AccèsProjetAutoriséEvent,
  accèsProjetAutoriséHandler,
} from './handlers/accèsProjetAutorisé.handler.js';
import {
  type AccèsProjetRemplacéEvent,
  accèsProjetRemplacéHandler,
} from './handlers/accèsProjetRemplacé.handler.js';

export type SubscriptionEvent = AccèsProjetAutoriséEvent | AccèsProjetRemplacéEvent;

export type Execute = Message<'System.Utilisateur.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    await match(event)
      .with({ type: 'AccèsProjetAutorisé-V1' }, accèsProjetAutoriséHandler)
      .with({ type: 'AccèsProjetRemplacé-V1' }, accèsProjetRemplacéHandler)
      .exhaustive();

  mediator.register('System.Utilisateur.Saga.Execute', handler);
};
