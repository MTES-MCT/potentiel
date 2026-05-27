import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import type { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';
import { IdentifiantProjet } from '../../../index.js';
import { DocumentAchèvement } from '../index.js';
import type { ModifierAttestationConformitéCommand } from './modifierAttestationConformité.command.js';

export type ModifierAttestationConformitéUseCase = Message<
  'Lauréat.Achèvement.UseCase.ModifierAttestationConformité',
  {
    identifiantProjetValue: string;
    modifiéeParValue: string;
    modifiéeLeValue: string;
    attestationValue: {
      content: ReadableStream;
      format: string;
    };
    rapportAssociéValue: {
      content: ReadableStream;
      format: string;
    };
  }
>;

export const registerModifierAttestationConformitéUseCase = () => {
  const runner: MessageHandler<ModifierAttestationConformitéUseCase> = async ({
    identifiantProjetValue,
    attestationValue,
    rapportAssociéValue,
    modifiéeLeValue,
    modifiéeParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const attestation = DocumentAchèvement.attestationConformité({
      identifiantProjet: identifiantProjet.formatter(),
      enregistréLe: modifiéeLeValue,
      attestation: attestationValue,
    });

    const rapportAssocié = DocumentAchèvement.rapportAssocié({
      identifiantProjet: identifiantProjet.formatter(),
      enregistréLe: modifiéeLeValue,
      rapportAssocie: rapportAssociéValue,
    });

    const modifiéeLe = DateTime.convertirEnValueType(modifiéeLeValue);
    const modifiéePar = Email.convertirEnValueType(modifiéeParValue);

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
        content: rapportAssociéValue.content,
        documentProjet: rapportAssocié,
      },
    });

    await mediator.send<ModifierAttestationConformitéCommand>({
      type: 'Lauréat.Achèvement.Command.ModifierAttestationConformité',
      data: {
        identifiantProjet,
        attestation,
        rapportAssocié,
        modifiéeLe,
        modifiéePar,
      },
    });
  };
  mediator.register('Lauréat.Achèvement.UseCase.ModifierAttestationConformité', runner);
};
