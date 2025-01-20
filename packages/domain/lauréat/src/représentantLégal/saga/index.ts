import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';

import { LauréatNotifiéEvent } from '../../lauréat';
import { AbandonAccordéEvent } from '../../abandon';

import { handleLauréatNotifié } from './handleLauréatNotifié';
import { handleTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée } from './handleTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée';
import { handleAbandonAccordé } from './handleAbandonAccordé';

export type SubscriptionEvent =
  | LauréatNotifiéEvent
  | TâchePlanifiéeExecutéeEvent
  | AbandonAccordéEvent;

export type Execute = Message<'System.Lauréat.ReprésentantLégal.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V1' }, handleLauréatNotifié)
      .with(
        {
          type: 'TâchePlanifiéeExecutée-V1',
        },
        handleTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée,
      )
      .with({ type: 'AbandonAccordé-V1' }, handleAbandonAccordé)
      .exhaustive();

  mediator.register('System.Lauréat.ReprésentantLégal.Saga.Execute', handler);
};
