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
    garantiesFinancièresValue: {
      type: string;
      dateÉchéance: string | undefined;
    };
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
    garantiesFinancièresValue,
    modifiéParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const garantiesFinancières =
      GarantiesFinancières.convertirEnValueType(garantiesFinancièresValue);
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const modifiéLe = DateTime.convertirEnValueType(modifiéLeValue);
    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentGarantiesFinancières.attestationGarantiesFinancièresActuellesValueType.formatter(),
      dateConstitutionValue,
      attestationValue.format,
    );
    const modifiéPar = Email.convertirEnValueType(modifiéParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<ModifierGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.ModifierGarantiesFinancières',
      data: {
        attestation,
        dateConstitution,
        identifiantProjet,
        garantiesFinancières,
        modifiéLe,
        modifiéPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.ModifierGarantiesFinancières', runner);
};
