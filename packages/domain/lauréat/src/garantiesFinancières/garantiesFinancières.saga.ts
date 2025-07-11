import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { ÉchoirGarantiesFinancièresCommand } from './garantiesFinancièresActuelles/échoir/échoirGarantiesFinancières.command';

export type SubscriptionEvent = Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent;

export type Execute = Message<
  'System.Lauréat.GarantiesFinancières.Saga.Execute',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) =>
    match(event)
      .with(
        { type: 'TâchePlanifiéeExecutée-V1' },
        async ({ payload: { identifiantProjet, typeTâchePlanifiée } }) => {
          if (
            typeTâchePlanifiée ===
            Lauréat.GarantiesFinancières.TypeTâchePlanifiéeGarantiesFinancières.échoir.type
          ) {
            await mediator.send<ÉchoirGarantiesFinancièresCommand>({
              type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
              data: {
                identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
              },
            });
          }
        },
      )
      .exhaustive();
  mediator.register('System.Lauréat.GarantiesFinancières.Saga.Execute', handler);
};
