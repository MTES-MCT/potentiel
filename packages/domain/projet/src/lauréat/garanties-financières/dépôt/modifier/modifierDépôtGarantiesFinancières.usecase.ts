import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GarantiesFinancières, TypeDocumentGarantiesFinancières } from '../..';

import { ModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifierDépôtGarantiesFinancières.command';

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
    const garantiesFinancières = GarantiesFinancières.convertirEnValueType({
      type: typeValue,
      dateÉchéance: dateÉchéanceValue,
    });
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
        garantiesFinancières,
      },
    });
  };
  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
    runner,
  );
};
