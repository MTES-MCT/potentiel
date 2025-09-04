import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DocumentProjetCommand, DossierProjet } from '@potentiel-domain/document';

import { TypeDocumentGarantiesFinancières } from '../..';

import { ValiderDépôtGarantiesFinancièresEnCoursCommand } from './validerDépôtGarantiesFinancières.command';

export type ValiderDépôtGarantiesFinancièresEnCoursUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjetValue: string;
    validéLeValue: string;
    validéParValue: string;
  }
>;

export const registerValiderDépôtGarantiesFinancièresEnCoursUseCase = () => {
  const runner: MessageHandler<ValiderDépôtGarantiesFinancièresEnCoursUseCase> = async ({
    identifiantProjetValue,
    validéLeValue,
    validéParValue,
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
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ValiderDépôtGarantiesFinancièresEnCours',
    runner,
  );
};
