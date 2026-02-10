import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../../index.js';

import { AnnulerChangementActionnaireCommand } from './annulerChangementActionnaire.command.js';

export type AnnulerChangementActionnaireUseCase = Message<
  'Lauréat.Actionnaire.UseCase.AnnulerDemandeChangement',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerChangementActionnaireUseCase = () => {
  const runner: MessageHandler<AnnulerChangementActionnaireUseCase> = async ({
    identifiantUtilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<AnnulerChangementActionnaireCommand>({
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
