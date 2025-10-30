import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Abandon } from '../..';
import { Lauréat } from '../../..';

import { handleAbandonAccordé, handleTâchePlanifiéeReprésentantLégalExecutée } from './handlers';
type Event = { version: number; created_at: string; stream_id: string };
export type SubscriptionEvent = (
  | Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent
  | Abandon.AbandonAccordéEvent
) &
  Event;

export type Execute = Message<'System.Lauréat.ReprésentantLégal.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with(
        {
          type: 'TâchePlanifiéeExecutée-V1',
        },
        handleTâchePlanifiéeReprésentantLégalExecutée,
      )

      .with({ type: 'AbandonAccordé-V1' }, handleAbandonAccordé)
      .exhaustive();

  mediator.register('System.Lauréat.ReprésentantLégal.Saga.Execute', handler);
};
