import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { TâchePlanifiéeExecutéeEvent } from '@potentiel-domain/tache-planifiee';

import { ÉchoirGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/échoir/échoirGarantiesFinancières.command';
import * as TypeTâchePlanifiéeGarantiesFinancières from './typeTâchePlanifiéeGarantiesFinancières.valueType';

export type SubscriptionEvent = TâchePlanifiéeExecutéeEvent;

export type Execute = Message<
  'System.Lauréat.GarantiesFinancières.Saga.Execute',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet, typeTâchePlanifiée },
    } = event;
    if (TypeTâchePlanifiéeGarantiesFinancières.échoir.type === typeTâchePlanifiée) {
      await mediator.send<ÉchoirGarantiesFinancièresCommand>({
        type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
        data: {
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        },
      });
    }
  };
  mediator.register('System.Lauréat.GarantiesFinancières.Saga.Execute', handler);
};
