import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';
import { DocumentAchèvement } from '../index.js';
import { EnregistrerDocumentProjetCommand } from '../../../document-projet/index.js';

import { ModifierAttestationConformitéCommand } from './modifierAttestationConformité.command.js';

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
  }
>;

export const registerModifierAttestationConformitéUseCase = () => {
  const runner: MessageHandler<ModifierAttestationConformitéUseCase> = async ({
    identifiantProjetValue,
    attestationValue,
    modifiéeLeValue,
    modifiéeParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const attestation = DocumentAchèvement.attestationConformité({
      identifiantProjet: identifiantProjet.formatter(),
      enregistréLe: modifiéeLeValue,
      attestation: attestationValue,
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

    await mediator.send<ModifierAttestationConformitéCommand>({
      type: 'Lauréat.Achèvement.Command.ModifierAttestationConformité',
      data: {
        identifiantProjet,
        attestation,
        modifiéeLe,
        modifiéePar,
      },
    });
  };
  mediator.register('Lauréat.Achèvement.UseCase.ModifierAttestationConformité', runner);
};
