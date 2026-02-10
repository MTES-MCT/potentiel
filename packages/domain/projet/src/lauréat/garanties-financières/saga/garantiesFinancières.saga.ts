import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeExecutéeEvent } from '../../tâche-planifiée/index.js';
import { LauréatNotifiéEvent } from '../../notifier/lauréatNotifié.event.js';
import { RécupererConstitutionGarantiesFinancièresPort } from '../index.js';

import { handleLauréatNotifié, handleTâchePlanifiéeExecutée } from './handlers/index.js';

export type SubscriptionEvent = TâchePlanifiéeExecutéeEvent | LauréatNotifiéEvent;

export type Execute = Message<
  'System.Lauréat.GarantiesFinancières.Saga.Execute',
  SubscriptionEvent
>;

type GarantiesFinancièresSagaDependnencies = {
  récupererConstitutionGarantiesFinancières: RécupererConstitutionGarantiesFinancièresPort;
};

export const register = ({
  récupererConstitutionGarantiesFinancières,
}: GarantiesFinancièresSagaDependnencies) => {
  const handler: MessageHandler<Execute> = async (event) => {
    await match(event)
      .with({ type: 'LauréatNotifié-V2' }, (event) =>
        handleLauréatNotifié(event, récupererConstitutionGarantiesFinancières),
      )
      .with({ type: 'TâchePlanifiéeExecutée-V1' }, handleTâchePlanifiéeExecutée)
      .exhaustive();
  };
  mediator.register('System.Lauréat.GarantiesFinancières.Saga.Execute', handler);
};
