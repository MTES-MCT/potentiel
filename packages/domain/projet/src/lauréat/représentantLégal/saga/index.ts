import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';

import { Abandon } from '../..';

import { abandonAccordéSaga } from './abandonAccordé.saga';
import { tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeSaga } from './tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée.saga';

type Event = { version: number; created_at: string; stream_id: string };
export type SubscriptionEvent = (TâchePlanifiéeExecutéeEvent | Abandon.AbandonAccordéEvent) & Event;

export type Execute = Message<'System.Lauréat.ReprésentantLégal.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with(
        {
          type: 'TâchePlanifiéeExecutée-V1',
        },
        tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeSaga,
      )
      .with({ type: 'AbandonAccordé-V1' }, abandonAccordéSaga)
      .exhaustive();

  mediator.register('System.Lauréat.ReprésentantLégal.Saga.Execute', handler);
};
