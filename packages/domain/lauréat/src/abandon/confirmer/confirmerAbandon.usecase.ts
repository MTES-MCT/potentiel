import { Message, MessageHandler, mediator } from 'mediateur';
import { ConfirmerAbandonCommand } from './confirmerAbandon.command';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Utilisateur } from '@potentiel-domain/utilisateur';

export type ConfirmerAbandonUseCase = Message<
  'CONFIRMER_ABANDON_USECASE',
  {
    dateConfirmationValue: string;
    utilisateurValue: string;
    identifiantProjetValue: string;
  }
>;

export const registerConfirmerAbandonUseCase = () => {
  const runner: MessageHandler<ConfirmerAbandonUseCase> = async ({
    dateConfirmationValue,
    identifiantProjetValue,
    utilisateurValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateConfirmation = DateTime.convertirEnValueType(dateConfirmationValue);
    const { identifiantUtilisateur } = Utilisateur.convertirEnValueType(utilisateurValue);

    await mediator.send<ConfirmerAbandonCommand>({
      type: 'CONFIRMER_ABANDON_COMMAND',
      data: {
        dateConfirmation,
        identifiantProjet,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('CONFIRMER_ABANDON_USECASE', runner);
};
