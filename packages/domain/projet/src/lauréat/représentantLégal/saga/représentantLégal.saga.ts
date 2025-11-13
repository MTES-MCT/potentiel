import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Abandon } from '../..';
import { Lauréat } from '../../..';

import { handleAbandonAccordé, handleTâchePlanifiéeReprésentantLégalExecutée } from './handlers';
export type SubscriptionEvent =
  | Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent
  | Abandon.AbandonAccordéEvent;

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
