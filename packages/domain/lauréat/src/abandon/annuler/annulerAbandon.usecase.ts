import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AcheverTâcheCommand } from '@potentiel-domain/tache';

import * as TypeTâcheAbandon from '../typeTâcheAbandon.valueType';

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
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    await mediator.send<AnnulerAbandonCommand>({
      type: 'Lauréat.Abandon.Command.AnnulerAbandon',
      data: {
        dateAnnulation,
        identifiantUtilisateur,
        identifiantProjet,
      },
    });

    await mediator.send<AcheverTâcheCommand>({
      type: 'System.Tâche.Command.AcheverTâche',
      data: {
        identifiantProjet,
        typeTâche: TypeTâcheAbandon.abandonConfirmer,
      },
    });
  };

  mediator.register('Lauréat.Abandon.UseCase.AnnulerAbandon', runner);
};
