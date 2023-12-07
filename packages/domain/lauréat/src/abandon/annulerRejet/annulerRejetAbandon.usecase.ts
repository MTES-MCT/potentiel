import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Utilisateur } from '@potentiel-domain/utilisateur';
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
    const { identifiantUtilisateur } = Utilisateur.convertirEnValueType(utilisateurValue);

    await mediator.send<AnnulerRejetAbandonCommand>({
      type: 'ANNULER_REJET_ABANDON_COMMAND',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('ANNULER_REJET_ABANDON_USECASE', runner);
};
