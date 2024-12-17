import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { AnnulerDemandeChangementActionnaireCommand } from './annulerDemandeChangement.command';

export type AnnulerDemandeChangementActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.AnnulerDemandeChangement',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerDemandeChangementActionnaireUseCase = () => {
  const runner: MessageHandler<AnnulerDemandeChangementActionnaireUseCase> = async ({
    identifiantUtilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<AnnulerDemandeChangementActionnaireCommand>({
      type: 'Lauréat.Actionnaire.Command.AnnulerDemandeChangement',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('Lauréat.Actionnaire.UseCase.AnnulerDemandeChangement', runner);
};
