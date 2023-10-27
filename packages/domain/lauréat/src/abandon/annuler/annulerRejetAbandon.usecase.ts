import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { AnnulerRejetAbandonCommand } from './annulerRejetAbandon.command';

export type AnnulerRejetAbandonUseCase = Message<
  'ANNULER_REJET_ABANDON_USECASE',
  {
    identifiantProjetValue: string;
    utilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerRejetAbandonUseCase = () => {
  const runner: MessageHandler<AnnulerRejetAbandonUseCase> = async ({
    utilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);

    await mediator.send<AnnulerRejetAbandonCommand>({
      type: 'ANNULER_REJET_ABANDON_COMMAND',
      data: {
        dateAnnulation,
        utilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('ANNULER_REJET_ABANDON_USECASE', runner);
};
