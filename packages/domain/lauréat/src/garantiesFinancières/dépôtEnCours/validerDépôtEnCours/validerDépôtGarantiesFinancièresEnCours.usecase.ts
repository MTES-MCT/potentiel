import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjetCommand, DossierProjet } from '@potentiel-domain/document';
import { AjouterTâchePlanifiéeCommand } from '@potentiel-domain/tache-planifiee';

import { TypeDocumentGarantiesFinancières } from '../..';
import * as TypeTâchePlanifiéeGarantiesFinancières from '../../typeTâchePlanifiéeGarantiesFinancières.valueType';

import { ValiderDépôtGarantiesFinancièresEnCoursCommand } from './validerDépôtGarantiesFinancièresEnCours.command';

export type ValiderDépôtGarantiesFinancièresEnCoursUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjetValue: string;
    validéLeValue: string;
    validéParValue: string;
    dateÉchéanceValue?: string;
  }
>;

export const registerValiderDépôtGarantiesFinancièresEnCoursUseCase = () => {
  const runner: MessageHandler<ValiderDépôtGarantiesFinancièresEnCoursUseCase> = async ({
    identifiantProjetValue,
    validéLeValue,
    validéParValue,
    dateÉchéanceValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const validéLe = DateTime.convertirEnValueType(validéLeValue);
    const validéPar = IdentifiantUtilisateur.convertirEnValueType(validéParValue);

    await mediator.send<DocumentProjetCommand>({
      type: 'Document.Command.DéplacerDocumentProjet',
      data: {
        dossierProjetSource: DossierProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
        ),
        dossierProjetTarget: DossierProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
        ),
      },
    });

    await mediator.send<ValiderDépôtGarantiesFinancièresEnCoursCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ValiderDépôtGarantiesFinancièresEnCours',
      data: {
        identifiantProjet,
        validéLe,
        validéPar,
      },
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
    'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
    runner,
  );
};
