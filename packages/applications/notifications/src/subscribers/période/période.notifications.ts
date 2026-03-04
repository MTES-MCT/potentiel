import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Période } from '@potentiel-domain/periode';

import { handlePériodeNotifiée } from './handlers/index.js';

export type SubscriptionEvent = Période.PériodeEvent;

export type Execute = Message<'System.Notification.Période', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event).with({ type: 'PériodeNotifiée-V1' }, handlePériodeNotifiée).exhaustive();

  mediator.register('System.Notification.Période', handler);
};
