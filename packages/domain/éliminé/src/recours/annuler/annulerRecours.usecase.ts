import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AnnulerRecoursCommand } from './annulerRecours.command';

export type AnnulerRecoursUseCase = Message<
  'ANNULER_RECOURS_USECASE',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerRecoursUseCase = () => {
  const runner: MessageHandler<AnnulerRecoursUseCase> = async ({
    identifiantUtilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    await mediator.send<AnnulerRecoursCommand>({
      type: 'ANNULER_RECOURS_COMMAND',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('ANNULER_RECOURS_USECASE', runner);
};
