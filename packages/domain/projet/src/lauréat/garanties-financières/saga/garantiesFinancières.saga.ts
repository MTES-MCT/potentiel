import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { TâchePlanifiéeExecutéeEvent } from '../../tâche-planifiée';
import { LauréatNotifiéEvent } from '../../notifier/lauréatNotifié.event';
import { RécupererConstitutionGarantiesFinancièresPort } from '..';

import { handleLauréatNotifié, handleTâchePlanifiéeExecutée } from './handlers';

type Event = { version: number; created_at: string; stream_id: string };

export type SubscriptionEvent = (TâchePlanifiéeExecutéeEvent | LauréatNotifiéEvent) & Event;

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
