import { Message, MessageHandler, mediator } from 'mediateur';

import { RebuildTriggered, Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Abandon } from '@potentiel-domain/laureat';

export type SubscriptionEvent = (Abandon.AbandonEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Historique', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async () => {};

  mediator.register('System.Projector.Historique', handler);
};
