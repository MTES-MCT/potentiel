import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAccordéEvent } from '../../abandon';

import { lauréatNotifiéSaga } from './lauréatNotifié.saga';
import { abandonAccordéSaga } from './abandonAccordé.saga';

export type SubscriptionEvent = Lauréat.LauréatNotifiéEvent | AbandonAccordéEvent;

export type Execute = Message<'System.Lauréat.Puissance.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V2' }, lauréatNotifiéSaga)
      .with({ type: 'AbandonAccordé-V1' }, abandonAccordéSaga)
      .exhaustive();

  mediator.register('System.Lauréat.Puissance.Saga.Execute', handler);
};
