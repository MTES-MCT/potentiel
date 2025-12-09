import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

import { AnnulerAbandonCommand } from './annulerAbandon.command';

export type AnnulerAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.AnnulerAbandon',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerAbandonUseCase = () => {
  const runner: MessageHandler<AnnulerAbandonUseCase> = async ({
    identifiantUtilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<AnnulerAbandonCommand>({
      type: 'Lauréat.Abandon.Command.AnnulerAbandon',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('Lauréat.Abandon.UseCase.AnnulerAbandon', runner);
};
