import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../../index.js';
import { DocumentGarantiesFinancières, GarantiesFinancières } from '../../index.js';
import type { ModifierDépôtGarantiesFinancièresEnCoursCommand } from './modifierDépôtGarantiesFinancières.command.js';

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
    estUnNouveauDocumentValue: boolean;
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
    estUnNouveauDocumentValue,
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
        estUnNouveauDocument: estUnNouveauDocumentValue,
      },
    });
  };

  mediator.register(
    'Lauréat.GarantiesFinancières.UseCase.ModifierDépôtGarantiesFinancièresEnCours',
    runner,
  );
};
