import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../index.js';
import { DocumentAchèvement } from '../index.js';
import type { ModifierAchèvementCommand } from './modifierAchèvement.command.js';

export type ModifierAchèvementUseCase = Message<
  'Lauréat.Achèvement.UseCase.ModifierAchèvement',
  {
    identifiantProjetValue: string;
    dateTransmissionAuCocontractantValue: string;
    dateValue: string;
    utilisateurValue: string;
    raisonValue: string;
    attestationValue?: {
      content: ReadableStream;
      format: string;
    };
    rapportAssociéValue?: {
      content: ReadableStream;
      format: string;
    };
    preuveTransmissionAuCocontractantValue?: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierAchèvementUseCase = () => {
  const runner: MessageHandler<ModifierAchèvementUseCase> = async ({
    identifiantProjetValue,
    dateTransmissionAuCocontractantValue,
    dateValue,
    utilisateurValue,
    raisonValue,
    attestationValue,
    rapportAssociéValue,
    preuveTransmissionAuCocontractantValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const date = DateTime.convertirEnValueType(dateValue);
    const dateTransmissionAuCocontractant = DateTime.convertirEnValueType(
      dateTransmissionAuCocontractantValue,
    );
    const identifiantUtilisateur = Email.convertirEnValueType(utilisateurValue);

    const attestation = attestationValue
      ? DocumentAchèvement.attestationConformité({
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe: DateTime.convertirEnValueType(dateValue).formatter(),
          attestation: attestationValue,
        })
      : undefined;
    const rapportAssocié = rapportAssociéValue
      ? DocumentAchèvement.rapportAssocié({
          identifiantProjet: identifiantProjet.formatter(),
          enregistréLe: DateTime.convertirEnValueType(dateValue).formatter(),
          rapportAssocie: rapportAssociéValue,
        })
      : undefined;
    const preuveTransmissionAuCocontractant = preuveTransmissionAuCocontractantValue
      ? DocumentAchèvement.preuveTransmissionAttestationConformité({
          identifiantProjet: identifiantProjet.formatter(),
          dateTransmissionAuCocontractant: dateTransmissionAuCocontractant.formatter(),
          preuveTransmissionAuCocontractant: preuveTransmissionAuCocontractantValue,
        })
      : undefined;

    if (attestation && attestationValue) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: attestationValue.content,
          documentProjet: attestation,
        },
      });
    }

    if (rapportAssocié && rapportAssociéValue) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: rapportAssociéValue.content,
          documentProjet: rapportAssocié,
        },
      });
    }

    if (preuveTransmissionAuCocontractant && preuveTransmissionAuCocontractantValue) {
      await mediator.send<EnregistrerDocumentProjetCommand>({
        type: 'Document.Command.EnregistrerDocumentProjet',
        data: {
          content: preuveTransmissionAuCocontractantValue.content,
          documentProjet: preuveTransmissionAuCocontractant,
        },
      });
    }

    await mediator.send<ModifierAchèvementCommand>({
      type: 'Lauréat.Achèvement.Command.ModifierAchèvement',
      data: {
        identifiantProjet,
        date,
        dateTransmissionAuCocontractant,
        identifiantUtilisateur,
        raison: raisonValue,
        attestation,
        rapportAssocié,
        preuveTransmissionAuCocontractant,
      },
    });
  };
  mediator.register('Lauréat.Achèvement.UseCase.ModifierAchèvement', runner);
};
