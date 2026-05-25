import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../index.js';
import { DocumentAchèvement } from '../index.js';
import type { EnregistrerAttestationConformitéCommand } from './enregistrerAttestationConformité.command.js';

export type EnregistrerAttestationConformitéUseCase = Message<
  'Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité',
  {
    identifiantProjetValue: string;
    attestationConformitéValue: {
      format: string;
      content: ReadableStream;
    };
    rapportAssociéValue: {
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
    rapportAssociéValue,
    enregistréeLeValue,
    enregistréeParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const enregistréeLe = DateTime.convertirEnValueType(enregistréeLeValue);
    const enregistréePar = Email.convertirEnValueType(enregistréeParValue);

    const attestation = DocumentAchèvement.attestationConformité({
      identifiantProjet: identifiantProjet.formatter(),
      enregistréLe: enregistréeLe.formatter(),
      attestation: attestationConformitéValue,
    });

    const rapportAssocié = DocumentAchèvement.rapportAssocié({
      identifiantProjet: identifiantProjet.formatter(),
      enregistréLe: enregistréeLe.formatter(),
      rapportAssocie: rapportAssociéValue,
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationConformitéValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: rapportAssociéValue.content,
        documentProjet: rapportAssocié,
      },
    });

    await mediator.send<EnregistrerAttestationConformitéCommand>({
      type: 'Lauréat.Achèvement.Command.EnregistrerAttestationConformité',
      data: {
        identifiantProjet,
        attestationConformité: attestationConformitéValue,
        rapportAssocié: rapportAssociéValue,
        enregistréeLe,
        enregistréePar,
      },
    });
  };
  mediator.register('Lauréat.Achèvement.UseCase.EnregistrerAttestationConformité', runner);
};
