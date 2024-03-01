import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { TypeGarantiesFinancières } from '..';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { ImporterTypeGarantiesFinancièresCommand } from './importerTypeGarantiesFinancières.command';

export type ImporterTypeGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue?: string;
    importéLeValue: string;
    importéParValue: string;
  }
>;

export const registerImporterTypeGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ImporterTypeGarantiesFinancièresUseCase> = async ({
    identifiantProjetValue,
    typeValue,
    dateÉchéanceValue,
    importéLeValue,
    importéParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const type = TypeGarantiesFinancières.convertirEnValueType(typeValue);
    const dateÉchéance = dateÉchéanceValue
      ? DateTime.convertirEnValueType(dateÉchéanceValue)
      : undefined;
    const importéLe = DateTime.convertirEnValueType(importéLeValue);
    const importéPar = IdentifiantUtilisateur.convertirEnValueType(importéParValue);

    await mediator.send<ImporterTypeGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ImporterTypeGarantiesFinancières',
      data: { identifiantProjet, importéLe, importéPar, type, dateÉchéance },
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
    runner,
  );
};
