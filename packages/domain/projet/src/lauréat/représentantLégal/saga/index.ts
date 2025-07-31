import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Abandon } from '../..';
import { Lauréat } from '../../..';

import { abandonAccordéSaga } from './abandonAccordé.saga';
import { tâchePlanifiéeReprésentantLégalExecutéeSaga } from './tâchePlanifiéeReprésentantLégalExecutée.saga';
import { tâchePlanifiéeReprésentantLégalAnnuléeSaga } from './tâchePlanifiéeReprésentantLégalAnnulée.saga';

type Event = { version: number; created_at: string; stream_id: string };
export type SubscriptionEvent = (
  | Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent
  | Lauréat.TâchePlanifiée.TâchePlanifiéeAnnuléeEvent
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
        tâchePlanifiéeReprésentantLégalExecutéeSaga,
      )
      .with(
        {
          type: 'TâchePlanifiéeAnnulée-V1',
        },
        tâchePlanifiéeReprésentantLégalAnnuléeSaga,
      )
      .with({ type: 'AbandonAccordé-V1' }, abandonAccordéSaga)
      .exhaustive();

  mediator.register('System.Lauréat.ReprésentantLégal.Saga.Execute', handler);
};
