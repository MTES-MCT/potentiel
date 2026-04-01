import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { GarantiesFinancières, DocumentGarantiesFinancières } from '../../index.js';
import { IdentifiantProjet } from '../../../../index.js';

import { EnregistrerGarantiesFinancièresCommand } from './enregistrerGarantiesFinancières.command.js';

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
      dateÉchéance: dateÉchéanceValue,
      constitution: {
        attestation: { format: attestationValue.format },
        date: dateConstitutionValue,
      },
    });
    const attestation = DocumentGarantiesFinancières.attestationActuelle({
      identifiantProjet: identifiantProjetValue,
      dateConstitution: dateConstitutionValue,
      attestation: { format: attestationValue.format },
    });
    const enregistréLe = DateTime.convertirEnValueType(enregistréLeValue);
    const enregistréPar = Email.convertirEnValueType(enregistréParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
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
