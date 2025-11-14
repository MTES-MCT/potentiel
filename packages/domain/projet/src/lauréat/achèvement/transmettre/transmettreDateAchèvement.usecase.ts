import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../..';

import { TransmettreDateAchèvementCommand } from './transmettreDateAchèvement.command';

export type TransmettreDateAchèvementUseCase = Message<
  'Lauréat.Achèvement.UseCase.TransmettreDateAchèvement',
  {
    identifiantProjetValue: string;
    dateAchèvementValue: string;
    transmisLeValue: string;
    transmisParValue: string;
  }
>;

export const registerTransmettreDateAchèvementUseCase = () => {
  const runner: MessageHandler<TransmettreDateAchèvementUseCase> = async ({
    identifiantProjetValue,
    dateAchèvementValue,
    transmisLeValue,
    transmisParValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const dateAchèvement = DateTime.convertirEnValueType(dateAchèvementValue);
    const transmisLe = DateTime.convertirEnValueType(transmisLeValue);
    const transmisPar = Email.convertirEnValueType(transmisParValue);

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
        transmisLe,
        transmisPar,
      },
    });
  };

  mediator.register('Lauréat.Achèvement.UseCase.TransmettreDateAchèvement', runner);
};
