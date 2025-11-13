import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeDocumentAttestationConformité } from '..';
import { DocumentProjet, EnregistrerDocumentProjetCommand } from '../../../../document-projet';
import { IdentifiantProjet } from '../../../..';

import { ModifierAttestationConformitéCommand } from './modifierAttestationConformité.command';

export type ModifierAttestationConformitéUseCase = Message<
  'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
  {
    identifiantProjetValue: string;
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
    utilisateurValue: string;
  }
>;

export const registerModifierAttestationConformitéUseCase = () => {
  const runner: MessageHandler<ModifierAttestationConformitéUseCase> = async ({
    identifiantProjetValue,
    attestationValue,
    dateValue,
    preuveTransmissionAuCocontractantValue,
    dateTransmissionAuCocontractantValue,
    utilisateurValue,
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

    const identifiantUtilisateur = Email.convertirEnValueType(utilisateurValue);

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

    await mediator.send<ModifierAttestationConformitéCommand>({
      type: 'Lauréat.Achèvement.AttestationConformité.Command.ModifierAttestationConformité',
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
    'Lauréat.Achèvement.AttestationConformité.UseCase.ModifierAttestationConformité',
    runner,
  );
};
