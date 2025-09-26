import { Message, MessageHandler, mediator } from 'mediateur';

import { DocumentProjet, EnregistrerDocumentProjetCommand } from '@potentiel-domain/document';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { GarantiesFinancières, TypeDocumentGarantiesFinancières } from '../..';

import { EnregistrerGarantiesFinancièresCommand } from './enregistrerGarantiesFinancières.command';

export type EnregistrerGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières',
  {
    identifiantProjetValue: string;
    typeValue: string;
    dateÉchéanceValue: string | undefined;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    enregistréLeValue: string;
    enregistréParValue: string;
  }
>;

export const registerEnregistrerGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EnregistrerGarantiesFinancièresUseCase> = async ({
    attestationValue,
    typeValue,
    dateÉchéanceValue,
    dateConstitutionValue,
    identifiantProjetValue,
    enregistréLeValue,
    enregistréParValue,
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
    const enregistréLe = DateTime.convertirEnValueType(enregistréLeValue);
    const enregistréPar = Email.convertirEnValueType(enregistréParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet,
      },
    });

    await mediator.send<EnregistrerGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.EnregistrerGarantiesFinancières',
      data: {
        identifiantProjet,
        garantiesFinancières,
        enregistréLe,
        enregistréPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.EnregistrerGarantiesFinancières', runner);
};
