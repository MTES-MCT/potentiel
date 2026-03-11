import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet, Lauréat } from '../../../index.js';
import {
  DocumentProjet,
  EnregistrerDocumentProjetCommand,
} from '../../../document-projet/index.js';

import { EnregistrerAttestationConformitéCommand } from './enregistrerAttestationConformité.command.js';

export type EnregistrerAttestationConformitéUseCase = Message<
  'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
  {
    identifiantProjetValue: string;
    attestationConformitéValue: {
      format: string;
      content: ReadableStream;
    };
    enregistréeLeValue: string;
    enregistréeParValue: string;
  }
>;

export const registerEnregistrerAttestationConformitéUseCase = () => {
  const runner: MessageHandler<EnregistrerAttestationConformitéUseCase> = async ({
    identifiantProjetValue,
    attestationConformitéValue,
    enregistréeLeValue,
    enregistréeParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const enregistréeLe = DateTime.convertirEnValueType(enregistréeLeValue);
    const enregistréePar = Email.convertirEnValueType(enregistréeParValue);

    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
      enregistréeLeValue,
      attestationConformitéValue.format,
    );

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationConformitéValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<EnregistrerAttestationConformitéCommand>({
      type: 'Lauréat.Achèvement.Command.EnregistrerAttestationConformité',
      data: {
        identifiantProjet,
        attestationConformité: attestationConformitéValue,
        enregistréeLe,
        enregistréePar,
      },
    });
  };
  mediator.register('Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité', runner);
};
