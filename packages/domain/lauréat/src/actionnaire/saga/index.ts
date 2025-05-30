import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { lauréatNotifiéSaga } from './lauréatNotifié.saga';
import { abandonAccordéSaga } from './abandonAccordé.saga';

export type SubscriptionEvent = Lauréat.LauréatNotifiéEvent | Lauréat.Abandon.AbandonAccordéEvent;

export type Execute = Message<'System.Lauréat.Actionnaire.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V2' }, lauréatNotifiéSaga)
      .with({ type: 'AbandonAccordé-V1' }, abandonAccordéSaga)
      .exhaustive();

  mediator.register('System.Lauréat.Actionnaire.Saga.Execute', handler);
};
