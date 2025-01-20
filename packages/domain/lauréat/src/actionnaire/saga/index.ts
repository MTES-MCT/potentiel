import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { LauréatNotifiéEvent } from '../../lauréat';
import { AbandonAccordéEvent } from '../../abandon';

import { handleLauréatNotifié } from './handleLauréatNotifié';
import { handleAbandonAccordé } from './handleAbandonAccordé';

export type SubscriptionEvent = LauréatNotifiéEvent | AbandonAccordéEvent;

export type Execute = Message<'System.Lauréat.Actionnaire.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V1' }, handleLauréatNotifié)
      .with({ type: 'AbandonAccordé-V1' }, handleAbandonAccordé)
      .exhaustive();

  mediator.register('System.Lauréat.Actionnaire.Saga.Execute', handler);
};
