import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';

import { Abandon } from '../..';

import { abandonAccordéSaga } from './abandonAccordé.saga';
import { tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeSaga } from './tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée.saga';

export type SubscriptionEvent = TâchePlanifiéeExecutéeEvent | Abandon.AbandonAccordéEvent;

export type Execute = Message<'System.Saga.Execute', SubscriptionEvent>;

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

  mediator.register('System.Saga.Execute', handler);
};
