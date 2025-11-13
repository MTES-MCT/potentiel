import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { LauréatNotifiéEvent } from '../../notifier/lauréatNotifié.event';
import { Lauréat, RécupererGRDParVillePort } from '../../..';

import { handleLauréatNotifié, handleTâchePlanifiéeExecutée } from './handlers';

export type SubscriptionEvent =
  | LauréatNotifiéEvent
  | Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent;

export type Execute = Message<'System.Lauréat.Raccordement.Saga.Execute', SubscriptionEvent>;

export type RegisterRaccordementSagaDependencies = {
  récupérerGRDParVille: RécupererGRDParVillePort;
};

export const register = ({ récupérerGRDParVille }: RegisterRaccordementSagaDependencies) => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with({ type: 'LauréatNotifié-V2' }, (event) =>
        handleLauréatNotifié({ event, récupérerGRDParVille }),
      )
      .with({ type: 'TâchePlanifiéeExecutée-V1' }, handleTâchePlanifiéeExecutée)
      .exhaustive();

  mediator.register('System.Lauréat.Raccordement.Saga.Execute', handler);
};
