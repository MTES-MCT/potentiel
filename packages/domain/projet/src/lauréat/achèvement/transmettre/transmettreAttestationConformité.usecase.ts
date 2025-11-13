import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, IdentifiantProjet } from '../../..';
import { TypeDocumentAttestationConformité } from '..';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet';

import { TransmettreAttestationConformitéCommand } from './transmettreAttestationConformité.command';

export type TransmettreAttestationConformitéUseCase = Message<
  'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
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
    const attestation = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
      dateValue,
      attestationValue.format,
    );
    const dateTransmissionAuCocontractant = DateTime.convertirEnValueType(
      dateTransmissionAuCocontractantValue,
    );
    const preuveTransmissionAuCocontractant = DocumentProjet.convertirEnValueType(
      identifiantProjetValue,
      TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
      dateTransmissionAuCocontractantValue,
      preuveTransmissionAuCocontractantValue.format,
    );
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
      type: 'Lauréat.Achèvement.AttestationConformité.Command.TransmettreAttestationConformité',
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
  mediator.register(
    'Lauréat.Achèvement.AttestationConformité.UseCase.TransmettreAttestationConformité',
    runner,
  );
};
