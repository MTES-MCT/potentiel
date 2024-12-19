import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';

import { LauréatNotifiéEvent } from '../../lauréat';

import { handleLauréatNotifié } from './handleLauréatNotifié';
import { handleTâchePlanifiéeExécutée } from './handleTâchePlanifiéeExecutée';

export type SubscriptionEvent = LauréatNotifiéEvent | TâchePlanifiéeExecutéeEvent;

export type Execute = Message<'System.Lauréat.ReprésentantLégal.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V1' }, handleLauréatNotifié)
      .with({ type: 'TâchePlanifiéeExecutée-V1' }, handleTâchePlanifiéeExécutée)
      .exhaustive();

  mediator.register('System.Lauréat.ReprésentantLégal.Saga.Execute', handler);
};
