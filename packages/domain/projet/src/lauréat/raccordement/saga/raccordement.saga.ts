import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { LauréatNotifiéEvent } from '../../notifier/lauréatNotifié.event.js';
import { Lauréat, RécupererGRDParVillePort } from '../../../index.js';

import { handleLauréatNotifié, handleTâchePlanifiéeExecutée } from './handlers/index.js';

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
