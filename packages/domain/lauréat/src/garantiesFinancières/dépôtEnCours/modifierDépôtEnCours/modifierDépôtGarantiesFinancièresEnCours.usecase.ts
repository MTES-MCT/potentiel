import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Candidature } from '@potentiel-domain/projet';

import { TypeDocumentGarantiesFinancières } from '../..';

import { ModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifierDépôtGarantiesFinancièresEnCours.command';

export type ModifierDépôtGarantiesFinancièresEnCoursUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue?: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    modifiéLeValue: string;
    modifiéParValue: string;
  }
>;

export const registerModifierDépôtGarantiesFinancièresEnCoursUseCase = () => {
  const runner: MessageHandler<ModifierDépôtGarantiesFinancièresEnCoursUseCase> = async ({
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    typeValue,
    dateÉchéanceValue,
    modifiéParValue,
    modifiéLeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const type = Candidature.TypeGarantiesFinancières.convertirEnValueType(typeValue);
    const dateÉchéance = dateÉchéanceValue
      ? DateTime.convertirEnValueType(dateÉchéanceValue)
      : undefined;
    const modifiéLe = DateTime.convertirEnValueType(modifiéLeValue);
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const modifiéPar = IdentifiantUtilisateur.convertirEnValueType(modifiéParValue);

    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
      dateConstitutionValue,
      attestationValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<ModifierDépôtGarantiesFinancièresEnCoursCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
      data: {
        attestation,
        dateConstitution,
        identifiantProjet,
        modifiéLe,
        modifiéPar,
        type,
        dateÉchéance,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
    runner,
  );
};
