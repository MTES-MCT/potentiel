import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ImporterTypeGarantiesFinancièresCommand } from './importerTypeGarantiesFinancières.command';

export type ImporterTypeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
  {
    identifiantProjetValue: string;
  }
>;

export const registerImporterTypeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ImporterTypeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    await mediator.send<ImporterTypeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
      data: { identifiantProjet },
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
    runner,
  );
};
