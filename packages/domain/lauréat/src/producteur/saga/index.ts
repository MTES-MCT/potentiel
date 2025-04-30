import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { lauréatNotifiéSaga } from './lauréatNotifié.saga';

export type SubscriptionEvent = Lauréat.LauréatNotifiéEvent;

export type Execute = Message<'System.Lauréat.Producteur.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event).with({ type: 'LauréatNotifié-V2' }, lauréatNotifiéSaga).exhaustive();

  mediator.register('System.Lauréat.Producteur.Saga.Execute', handler);
};
