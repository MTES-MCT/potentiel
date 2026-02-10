import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { TypeDocumentAttestationConformité } from '../index.js';
import { DocumentProjet, IdentifiantProjet } from '../../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';

import { ModifierAttestationConformitéCommand } from './modifierAttestationConformité.command.js';

export type ModifierAttestationConformitéUseCase = Message<
  'Lauréat.AchèvementUseCase.ModifierAttestationConformité',
  {
    identifiantProjetValue: string;
    attestationValue?: {
      content: ReadableStream;
      format: string;
    };
    dateTransmissionAuCocontractantValue: string;
    preuveTransmissionAuCocontractantValue?: {
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
    const attestation = attestationValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
          dateValue,
          attestationValue.format,
        )
      : undefined;
    const dateTransmissionAuCocontractant = DateTime.convertirEnValueType(
      dateTransmissionAuCocontractantValue,
    );
    const preuveTransmissionAuCocontractant = preuveTransmissionAuCocontractantValue
      ? DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentAttestationConformité.attestationConformitéPreuveTransmissionValueType.formatter(),
          dateTransmissionAuCocontractantValue,
          preuveTransmissionAuCocontractantValue.format,
        )
      : undefined;

    const date = DateTime.convertirEnValueType(dateValue);

    const identifiantUtilisateur = Email.convertirEnValueType(utilisateurValue);

    if (attestation) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: attestationValue!.content,
          documentProjet: attestation,
        },
      });
    }

    if (preuveTransmissionAuCocontractant) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: preuveTransmissionAuCocontractantValue!.content,
          documentProjet: preuveTransmissionAuCocontractant,
        },
      });
    }

    await mediator.send<ModifierAttestationConformitéCommand>({
      type: 'Lauréat.AchèvementCommand.ModifierAttestationConformité',
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
  mediator.register('Lauréat.AchèvementUseCase.ModifierAttestationConformité', runner);
};
