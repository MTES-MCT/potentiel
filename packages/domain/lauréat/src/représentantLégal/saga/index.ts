import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';

import { LauréatNotifiéEvent } from '../../lauréat';
import { TypeTâchePlanifiéeChangementReprésentantLégal } from '..';

import { handleLauréatNotifié } from './handleLauréatNotifié';
import { handleTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée } from './handleTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée';

export type SubscriptionEvent = LauréatNotifiéEvent | TâchePlanifiéeExecutéeEvent;

export type Execute = Message<'System.Lauréat.ReprésentantLégal.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V1' }, handleLauréatNotifié)
      .with(
        {
          type: 'TâchePlanifiéeExecutée-V1',
          payload: {
            typeTâchePlanifiée:
              TypeTâchePlanifiéeChangementReprésentantLégal.gestionAutomatiqueDemandeChangement
                .type,
          },
        },
        handleTâchePlanifiéeGestionAutomatiqueDemandeChangementExecutée,
      )
      .otherwise(() => {});

  mediator.register('System.Lauréat.ReprésentantLégal.Saga.Execute', handler);
};
