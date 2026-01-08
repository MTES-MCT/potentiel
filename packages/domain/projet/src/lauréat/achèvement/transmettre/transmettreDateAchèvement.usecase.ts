import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';
import { DocumentProjet, EnregistrerDocumentSubstitutCommand } from '../../../document-projet';
import { TypeDocumentAttestationConformité } from '..';

import { TransmettreDateAchèvementCommand } from './transmettreDateAchèvement.command';

export type TransmettreDateAchèvementUseCase = Message<
  'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
  {
    identifiantProjetValue: string;
    dateAchèvementValue: string;
    transmiseLeValue: string;
    transmiseParValue: string;
  }
>;

export const registerTransmettreDateAchèvementUseCase = () => {
  const runner: MessageHandler<TransmettreDateAchèvementUseCase> = async ({
    identifiantProjetValue,
    dateAchèvementValue,
    transmiseLeValue,
    transmiseParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const dateAchèvement = DateTime.convertirEnValueType(dateAchèvementValue);
    const transmiseLe = DateTime.convertirEnValueType(transmiseLeValue);
    const transmisePar = Email.convertirEnValueType(transmiseParValue);

    await mediator.send<EnregistrerDocumentSubstitutCommand>({
      type: 'Document.Command.EnregistrerDocumentSubstitut',
      data: {
        documentProjet: DocumentProjet.convertirEnValueType(
          identifiantProjetValue,
          TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
          transmiseLe.formatter(),
          'application/pdf',
        ),
        // aujourd'hui seul le co-contractant peut transmettre la date d'achèvement
        texte:
          "L'attestation de conformité a été transmise au co-contractant, qui a communiqué à Potentiel la date d'achèvement.",
      },
    });

    await mediator.send<TransmettreDateAchèvementCommand>({
      type: 'Lauréat.Achèvement.Command.TransmettreDateAchèvement',
      data: {
        identifiantProjet,
        dateAchèvement,
        attestation: { format: 'application/pdf' },
        transmiseLe,
        transmisePar,
      },
    });
  };

  mediator.register('Lauréat.Achèvement.UseCase.TransmettreDateAchèvement', runner);
};
