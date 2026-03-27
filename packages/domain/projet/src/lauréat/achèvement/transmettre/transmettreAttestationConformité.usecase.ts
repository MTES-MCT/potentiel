import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { DocumentAchèvement } from '../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';

import { TransmettreAttestationConformitéCommand } from './transmettreAttestationConformité.command.js';

export type TransmettreAttestationConformitéUseCase = Message<
  'Lauréat.Achèvement.UseCase.TransmettreAttestationConformité',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    dateTransmissionAuCocontractantValue: string;
    preuveTransmissionAuCocontractantValue: {
      content: ReadableStream;
      format: string;
    };
    dateValue: string;
  }
>;

export const registerTransmettreAttestationConformitéUseCase = () => {
  const runner: MessageHandler<TransmettreAttestationConformitéUseCase> = async ({
    identifiantProjetValue,
    attestationValue,
    dateValue,
    preuveTransmissionAuCocontractantValue,
    dateTransmissionAuCocontractantValue,
    identifiantUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const attestation = DocumentAchèvement.attestationConformité({
      identifiantProjet: identifiantProjet.formatter(),
      enregistréLe: DateTime.convertirEnValueType(dateValue).formatter(),
      'attestation-conformite': {
        format: attestationValue.format,
      },
    });
    const dateTransmissionAuCocontractant = DateTime.convertirEnValueType(
      dateTransmissionAuCocontractantValue,
    );
    const preuveTransmissionAuCocontractant =
      DocumentAchèvement.preuveTransmissionAttestationConformité({
        identifiantProjet: identifiantProjet.formatter(),
        enregistréLe: dateTransmissionAuCocontractant.formatter(),
        'preuve-transmission-attestation-conformite': {
          format: preuveTransmissionAuCocontractantValue.format,
        },
      });
    const date = DateTime.convertirEnValueType(dateValue);

    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: attestationValue.content,
        documentProjet: attestation,
      },
    });

    await mediator.send<EnregistrerDocumentProjetCommand>({
      type: 'Document.Command.EnregistrerDocumentProjet',
      data: {
        content: preuveTransmissionAuCocontractantValue.content,
        documentProjet: preuveTransmissionAuCocontractant,
      },
    });

    await mediator.send<TransmettreAttestationConformitéCommand>({
      type: 'Lauréat.Achèvement.Command.TransmettreAttestationConformité',
      data: {
        identifiantProjet,
        attestation,
        date,
        preuveTransmissionAuCocontractant,
        dateTransmissionAuCocontractant,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Achèvement.UseCase.TransmettreAttestationConformité', runner);
};
