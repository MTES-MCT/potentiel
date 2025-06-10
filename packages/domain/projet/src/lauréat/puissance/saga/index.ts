import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Event } from '@potentiel-infrastructure/pg-event-sourcing';

import { Lauréat } from '../../..';

import { abandonAccordéSaga } from './abandonAccordé.saga';

export type SubscriptionEvent = Lauréat.Abandon.AbandonAccordéEvent & Event;

export type Execute = Message<'System.Lauréat.Puissance.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event).with({ type: 'AbandonAccordé-V1' }, abandonAccordéSaga).exhaustive();

  mediator.register('System.Lauréat.Puissance.Saga.Execute', handler);
};
