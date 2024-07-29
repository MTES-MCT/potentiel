import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { AjouterTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import { TypeGarantiesFinancières } from '../..';
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
          typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.échoir.type,
          àExécuterLe: DateTime.convertirEnValueType(dateÉchéanceValue).ajouterNombreDeJours(1),
        },
      });

      const dateRelanceMoinsUnMois =
        DateTime.convertirEnValueType(dateÉchéanceValue).retirerNombreDeMois(1);

      const dateRelanceMoinsDeuxMois =
        DateTime.convertirEnValueType(dateÉchéanceValue).retirerNombreDeMois(2);

      await mediator.send<AjouterTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
        data: {
          identifiantProjet,
          typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceUnMois.type,
          àExécuterLe: dateRelanceMoinsUnMois,
        },
      });

      await mediator.send<AjouterTâchePlanifiéeCommand>({
        type: 'System.TâchePlanifiée.Command.AjouterTâchePlanifiée',
        data: {
          identifiantProjet,
          typeTâchePlanifiée: TypeTâchePlanifiéeGarantiesFinancières.rappelÉchéanceDeuxMois.type,
          àExécuterLe: dateRelanceMoinsDeuxMois,
        },
      });
    }
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ImporterTypeGarantiesFinancières',
    runner,
  );
};
