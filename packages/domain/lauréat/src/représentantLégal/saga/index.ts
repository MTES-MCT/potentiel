import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { LoadAggregate } from '@potentiel-domain/core';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';

import { LauréatNotifiéEvent } from '../../lauréat';
import { AbandonAccordéEvent } from '../../abandon';

import { buildTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeSaga } from './tâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée.saga';
import { buildAbandonAccordéSaga } from './abandonAccordé.saga';
import { buildLauréatNotifiéSaga } from './lauréatNotifié.saga';

export type SubscriptionEvent =
  | LauréatNotifiéEvent
  | TâchePlanifiéeExecutéeEvent
  | AbandonAccordéEvent;

export type Execute = Message<'System.Lauréat.ReprésentantLégal.Saga.Execute', SubscriptionEvent>;

export const register = (loadAggregate: LoadAggregate) => {
  const handleAbandonAccordé = buildAbandonAccordéSaga(loadAggregate);
  const handleLauréatNotifié = buildLauréatNotifiéSaga();
  const handleTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée =
    buildTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutéeSaga(loadAggregate);

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
