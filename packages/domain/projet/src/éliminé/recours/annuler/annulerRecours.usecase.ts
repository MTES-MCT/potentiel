import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

import { AnnulerRecoursCommand } from './annulerRecours.command.js';

export type AnnulerRecoursUseCase = Message<
  'Éliminé.Recours.UseCase.AnnulerRecours',
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
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<AnnulerRecoursCommand>({
      type: 'Éliminé.Recours.Command.AnnulerRecours',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('Éliminé.Recours.UseCase.AnnulerRecours', runner);
};
