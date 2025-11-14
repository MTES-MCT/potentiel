import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

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

    // await mediator.send<EnregistrerDocumentProjetCommand>({
    //   type: 'Document.Command.EnregistrerDocumentProjet',
    //   data: {
    //     content: attestationValue.content,
    //     documentProjet: attestation,
    //   },
    // });

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
