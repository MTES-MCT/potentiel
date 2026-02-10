import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../index.js';

import { AnnulerDemandeDélaiCommand } from './annulerDemandeDélai.command.js';

export type AnnulerDemandeDélaiUseCase = Message<
  'Lauréat.Délai.UseCase.AnnulerDemande',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerDemandeDélaiUseCase = () => {
  const runner: MessageHandler<AnnulerDemandeDélaiUseCase> = async ({
    identifiantUtilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<AnnulerDemandeDélaiCommand>({
      type: 'Lauréat.Délai.Command.AnnulerDemande',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('Lauréat.Délai.UseCase.AnnulerDemande', runner);
};
