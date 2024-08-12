import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet, TypeGarantiesFinancières } from '@potentiel-domain/common';
import { AjouterTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

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

    if (dateÉchéanceValue) {
      await mediator.send<AjouterTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
        data: {
          identifiantProjet,
          tâches: [
            {
              typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
              àExécuterLe: DateTime.convertirEnValueType(dateÉchéanceValue).ajouterNombreDeJours(1),
            },
            {
              typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type,
              àExécuterLe: DateTime.convertirEnValueType(dateÉchéanceValue).retirerNombreDeMois(1),
            },
            {
              typeTâchePlanifiée:
                TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois.type,
              àExécuterLe: DateTime.convertirEnValueType(dateÉchéanceValue).retirerNombreDeMois(2),
            },
          ],
        },
      });
    }
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
    runner,
  );
};
