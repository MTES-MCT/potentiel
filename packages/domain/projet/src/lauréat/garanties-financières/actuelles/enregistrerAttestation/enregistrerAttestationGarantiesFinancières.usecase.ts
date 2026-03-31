import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { EnregistrerDocumentProjetCommand } from '../../../../document-projet/index.js';
import { DocumentGarantiesFinancières } from '../../index.js';
import { IdentifiantProjet } from '../../../../index.js';

import { EnregistrerAttestationGarantiesFinancièresCommand } from './enregistrerAttestationGarantiesFinancières.command.js';

export type EnregistrerAttestationGarantiesFinancièresUseCase = Message<
  'Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation',
  {
    identifiantProjetValue: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateConstitutionValue: string;
    enregistréLeValue: string;
    enregistréParValue: string;
  }
>;

export const registerEnregistrerAttestationGarantiesFinancièresUseCase = () => {
  const runner: MessageHandler<EnregistrerAttestationGarantiesFinancièresUseCase> = async ({
    attestationValue,
    dateConstitutionValue,
    identifiantProjetValue,
    enregistréLeValue,
    enregistréParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateConstitution = DateTime.convertirEnValueType(dateConstitutionValue);
    const enregistréLe = DateTime.convertirEnValueType(enregistréLeValue);
    const attestation = DocumentGarantiesFinancières.attestationGarantiesFinancières({
      identifiantProjet: identifiantProjetValue,
      enregistréLe: dateConstitutionValue,
      attestation: { format: attestationValue.format },
    });
    const enregistréPar = Email.convertirEnValueType(enregistréParValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<EnregistrerAttestationGarantiesFinancièresCommand>({
      type: 'Lauréat.GarantiesFinancières.Command.EnregistrerAttestation',
      data: {
        attestation,
        dateConstitution,
        identifiantProjet,
        enregistréLe,
        enregistréPar,
      },
    });
  };
  mediator.register('Lauréat.GarantiesFinancières.UseCase.EnregistrerAttestation', runner);
};
