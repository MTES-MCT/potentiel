import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

export type ÉchoirGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ÉchoirGarantiesFinancières',
  {
    identifiantProjetValue: string;
    dateÉchéanceValue: string;
    échuLeValue: string;
    // vérifier la pertinence
    échuParValue: string;
  }
>;

export const registerÉchoirGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ÉchoirGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    dateÉchéanceValue,
    échuLeValue,
    échuParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateÉchéance = DateTime.convertirEnValueType(dateÉchéanceValue);
    const échuLe = DateTime.convertirEnValueType(échuLeValue);
    const échuPar = Email.convertirEnValueType(échuParValue);

    await mediator.send<ÉchoirGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ÉchoirGarantiesFinancières',
      data: {
        identifiantProjet,
        dateÉchéance,
        échuLe,
        échuPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.ÉchoirGarantiesFinancières', runner);
};
