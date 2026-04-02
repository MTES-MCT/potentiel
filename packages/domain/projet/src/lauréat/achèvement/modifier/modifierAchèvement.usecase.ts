import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentAchèvement } from '../index.js';
import { IdentifiantProjet } from '../../../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';

import { ModifierAchèvementCommand } from './modifierAchèvement.command.js';

export type ModifierAchèvementUseCase = Message<
  'Lauréat.Achèvement.UseCase.ModifierAchèvement',
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

export const registerModifierAchèvementUseCase = () => {
  const runner: MessageHandler<ModifierAchèvementUseCase> = async ({
    identifiantProjetValue,
    attestationValue,
    dateValue,
    preuveTransmissionAuCocontractantValue,
    dateTransmissionAuCocontractantValue,
    utilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const attestation = attestationValue
      ? DocumentAchèvement.attestationConformité({
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe: DateTime.convertirEnValueType(dateValue).formatter(),
          'attestation-conformite': {
            format: attestationValue.format,
          },
        })
      : undefined;
    const dateTransmissionAuCocontractant = DateTime.convertirEnValueType(
      dateTransmissionAuCocontractantValue,
    );
    const preuveTransmissionAuCocontractant = preuveTransmissionAuCocontractantValue
      ? DocumentAchèvement.preuveTransmissionAttestationConformité({
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe: dateTransmissionAuCocontractant.formatter(),
          'preuve-transmission-attestation-conformite': {
            format: preuveTransmissionAuCocontractantValue.format,
          },
        })
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

    await mediator.send<ModifierAchèvementCommand>({
      type: 'Lauréat.Achèvement.Command.ModifierAchèvement',
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
  mediator.register('Lauréat.Achèvement.UseCase.ModifierAchèvement', runner);
};
