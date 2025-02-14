import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjetCommand, DossierProjet } from '@potentiel-domain/document';

import { TypeDocumentGarantiesFinancières } from '../..';
import { AjouterTâchesGarantiesFinancièresCommand } from '../../tâches-planifiées/ajouter/ajouterTâches.command';

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

    await mediator.send<AjouterTâchesGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.AjouterTâches',
      data: {
        identifiantProjet,
        dateÉchéance: dateÉchéanceValue
          ? DateTime.convertirEnValueType(dateÉchéanceValue)
          : undefined,
      },
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
    runner,
  );
};
