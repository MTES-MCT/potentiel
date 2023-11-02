import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { AnnulerAbandonCommand } from './annulerAbandon.command';

export type AnnulerAbandonUseCase = Message<
  'ANNULER_ABANDON_USECASE',
  {
    identifiantProjetValue: string;
    utilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerAbandonUseCase = () => {
  const runner: MessageHandler<AnnulerAbandonUseCase> = async ({
    utilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);

    await mediator.send<AnnulerAbandonCommand>({
      type: 'ANNULER_ABANDON_COMMAND',
      data: {
        dateAnnulation,
        utilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('ANNULER_ABANDON_USECASE', runner);
};
