import { Message, MessageHandler, mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { ImporterTypeGarantiesFinancièresUseCase } from '.';

export type SubscriptionEvent = Lauréat.LauréatNotifiéEvent;

export type Execute = Message<
  'System.Lauréat.TypeGarantiesFinancières.Saga.Execute',
  SubscriptionEvent
>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiantProjet },
    } = event;
    switch (event.type) {
      case 'LauréatNotifié-V2':
        await mediator.send<ImporterTypeGarantiesFinancièresUseCase>({
          type: 'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
          data: {
            identifiantProjetValue: identifiantProjet,
          },
        });
        break;
    }
  };
  mediator.register('System.Lauréat.TypeGarantiesFinancières.Saga.Execute', handler);
};
