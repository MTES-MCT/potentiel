import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { AnnulerRejetAbandonCommand } from './annulerRejetAbandon.command';

export type AnnulerRejetAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.AnnulerRejetAbandon',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerRejetAbandonUseCase = () => {
  const runner: MessageHandler<AnnulerRejetAbandonUseCase> = async ({
    identifiantUtilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    await mediator.send<AnnulerRejetAbandonCommand>({
      type: 'Lauréat.Abandon.Command.AnnulerRejetAbandon',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('Lauréat.Abandon.UseCase.AnnulerRejetAbandon', runner);
};
