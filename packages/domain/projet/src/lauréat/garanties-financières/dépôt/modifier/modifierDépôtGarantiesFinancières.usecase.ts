import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { GarantiesFinancières, DocumentGarantiesFinancières } from '../../index.js';
import { IdentifiantProjet } from '../../../../index.js';

import { ModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifierDépôtGarantiesFinancières.command.js';

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
    estUnNouveauDocument: boolean;
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
    estUnNouveauDocument,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const garantiesFinancières = GarantiesFinancières.convertirEnValueType({
      type: typeValue,
      dateÉchéance: dateÉchéanceValue,
      constitution: {
        date: dateConstitutionValue,
        attestation: attestationValue,
      },
    });
    const documentProjet = DocumentGarantiesFinancières.attestationSoumise({
      identifiantProjet: identifiantProjetValue,
      dateConstitution: dateConstitutionValue,
      attestation: { format: attestationValue.format },
    });
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
        estUnNouveauDocument,
      },
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
    runner,
  );
};
