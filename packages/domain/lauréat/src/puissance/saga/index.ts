import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { LauréatNotifiéEvent } from '../../lauréat';

import { lauréatNotifiéSaga } from './lauréatNotifié.saga';

export type SubscriptionEvent = LauréatNotifiéEvent;

export type Execute = Message<'System.Lauréat.Puissance.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event).with({ type: 'LauréatNotifié-V2' }, lauréatNotifiéSaga).exhaustive();

  mediator.register('System.Lauréat.Puissance.Saga.Execute', handler);
};
