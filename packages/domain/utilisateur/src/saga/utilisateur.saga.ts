import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import {
  AccèsProjetAutoriséEvent,
  accèsProjetAutoriséHandler,
} from './handlers/accèsProjetAutorisé.handler';
import {
  AccèsProjetRemplacéEvent,
  accèsProjetRemplacéHandler,
} from './handlers/accèsProjetRemplacé.handler';

/** @deprecated hack due to typing requirements */
type Event = { version: number; created_at: string; stream_id: string };
export type SubscriptionEvent = (AccèsProjetAutoriséEvent | AccèsProjetRemplacéEvent) & Event;

export type Execute = Message<'System.Utilisateur.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    await match(event)
      .with({ type: 'AccèsProjetAutorisé-V1' }, accèsProjetAutoriséHandler)
      .with({ type: 'AccèsProjetRemplacé-V1' }, accèsProjetRemplacéHandler)
      .exhaustive();

  mediator.register('System.Utilisateur.Saga.Execute', handler);
};
