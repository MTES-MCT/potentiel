import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

import { ConfirmerAbandonCommand } from './confirmerAbandon.command';

export type ConfirmerAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.ConfirmerAbandon',
  {
    dateConfirmationValue: string;
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerConfirmerAbandonUseCase = () => {
  const runner: MessageHandler<ConfirmerAbandonUseCase> = async ({
    dateConfirmationValue,
    identifiantProjetValue,
    identifiantUtilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateConfirmation = DateTime.convertirEnValueType(dateConfirmationValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<ConfirmerAbandonCommand>({
      type: 'Lauréat.Abandon.Command.ConfirmerAbandon',
      data: {
        dateConfirmation,
        identifiantProjet,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.ConfirmerAbandon', runner);
};
