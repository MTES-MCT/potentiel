import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';
import { GarantiesFinancières, TypeDocumentGarantiesFinancières } from '../..';

import { ModifierGarantiesFinancièresCommand } from './modifierGarantiesFinancières.command';

export type ModifierGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières',
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

export const registerModifierGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<ModifierGarantiesFinancièresUseCase> = async ({
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    modifiéLeValue,
    typeValue,
    dateÉchéanceValue,
    modifiéParValue,
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
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
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

    await mediator.send<ModifierGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
      data: {
        identifiantProjet,
        garantiesFinancières,
        modifiéLe,
        modifiéPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières', runner);
};
