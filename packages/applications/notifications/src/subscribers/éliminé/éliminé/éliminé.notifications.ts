import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import type { Éliminé } from '@potentiel-domain/projet';

import { handleÉliminéNotifié } from './handlers/éliminéNotifié.handler.js';

export type SubscriptionEvent = Éliminé.ÉliminéNotifiéEvent;

export type Execute = Message<'System.Notification.Éliminé', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    return await match(event)
      .with({ type: 'ÉliminéNotifié-V1' }, handleÉliminéNotifié)
      .exhaustive();
  };

  mediator.register('System.Notification.Éliminé', handler);
};
