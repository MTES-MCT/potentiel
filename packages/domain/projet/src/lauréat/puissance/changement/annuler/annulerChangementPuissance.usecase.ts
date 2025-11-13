import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../..';

import { AnnulerChangementPuissanceCommand } from './annulerChangementPuissance.command';

export type AnnulerChangementPuissanceUseCase = Message<
  'Lauréat.Puissance.UseCase.AnnulerDemandeChangement',
  {
    identifiantProjetValue: string;
    identifiantUtilisateurValue: string;
    dateAnnulationValue: string;
  }
>;

export const registerAnnulerChangementPuissanceUseCase = () => {
  const runner: MessageHandler<AnnulerChangementPuissanceUseCase> = async ({
    identifiantUtilisateurValue,
    dateAnnulationValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const dateAnnulation = DateTime.convertirEnValueType(dateAnnulationValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    await mediator.send<AnnulerChangementPuissanceCommand>({
      type: 'Lauréat.Puissance.Command.AnnulerDemandeChangement',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });
  };

  mediator.register('Lauréat.Puissance.UseCase.AnnulerDemandeChangement', runner);
};
