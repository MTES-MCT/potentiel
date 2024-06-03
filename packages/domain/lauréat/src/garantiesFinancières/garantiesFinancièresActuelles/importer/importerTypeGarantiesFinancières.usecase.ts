import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TypeGarantiesFinancières } from '../..';
import { ImporterTypeGarantiesFinancièresCommand } from './importerTypeGarantiesFinancières.command';

export type ImporterTypeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue?: string;
    importéLeValue: string;
  }
>;

export const registerImporterTypeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ImporterTypeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    typeValue,
    dateÉchéanceValue,
    importéLeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const type = TypeGarantiesFinancières.convertirEnValueType(typeValue);
    const dateÉchéance = dateÉchéanceValue
      ? DateTime.convertirEnValueType(dateÉchéanceValue)
      : undefined;
    const importéLe = DateTime.convertirEnValueType(importéLeValue);

    await mediator.send<ImporterTypeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
      data: { identifiantProjet, importéLe, type, dateÉchéance },
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
    runner,
  );
};
