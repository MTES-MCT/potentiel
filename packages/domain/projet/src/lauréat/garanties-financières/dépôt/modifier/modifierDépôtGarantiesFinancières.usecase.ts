import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { GarantiesFinancières, TypeDocumentGarantiesFinancières } from '../..';

import { ModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifierDépôtGarantiesFinancières.command';

export type ModifierDépôtGarantiesFinancièresEnCoursUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue: string | undefined;
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
    typeValue,
    dateÉchéanceValue,
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    modifiéParValue,
    modifiéLeValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const garantiesFinancières = GarantiesFinancières.convertirEnValueType({
      type: typeValue,
      dateÉchéance:
        dateÉchéanceValue && DateTime.convertirEnValueType(dateÉchéanceValue).formatter(),
      attestation: { format: attestationValue.format },
      dateConstitution: DateTime.convertirEnValueType(dateConstitutionValue).formatter(),
    });
    const documentProjet = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresSoumisesValueType.formatter(),
      dateConstitutionValue,
      attestationValue.format,
    );
    const modifiéLe = DateTime.convertirEnValueType(modifiéLeValue);
    const modifiéPar = Email.convertirEnValueType(modifiéParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet,
      },
    });

    await mediator.send<ModifierDépôtGarantiesFinancièresEnCoursCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ModifierDépôtGarantiesFinancièresEnCours',
      data: {
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
