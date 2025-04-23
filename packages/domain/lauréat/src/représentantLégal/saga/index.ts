import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAccordéEvent } from '../../abandon';

import { lauréatNotifiéSaga } from './lauréatNotifié.saga';
import { abandonAccordéSaga } from './abandonAccordé.saga';
import { tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeSaga } from './tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée.saga';

export type SubscriptionEvent =
  | Lauréat.LauréatNotifiéEvent
  | TâchePlanifiéeExecutéeEvent
  | AbandonAccordéEvent;

export type Execute = Message<'System.Lauréat.ReprésentantLégal.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V2' }, lauréatNotifiéSaga)
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
