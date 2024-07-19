import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { ÉchoirGarantiesFinancièresCommand } from './échoirGarantiesFinancières.command';

export type ÉchoirGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ÉchoirGarantiesFinancières',
  {
    identifiantProjetValue: string;
    dateÉchéanceValue: string;
    échuLeValue: string;
  }
>;

export const registerÉchoirGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ÉchoirGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    dateÉchéanceValue,
    échuLeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateÉchéance = DateTime.convertirEnValueType(dateÉchéanceValue);
    const échuLe = DateTime.convertirEnValueType(échuLeValue);

    await mediator.send<ÉchoirGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
      data: {
        identifiantProjet,
        dateÉchéance,
        échuLe,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.ÉchoirGarantiesFinancières', runner);
};
