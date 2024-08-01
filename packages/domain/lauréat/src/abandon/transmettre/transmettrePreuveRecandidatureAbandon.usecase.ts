import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { AcheverTâcheCommand } from '@potentiel-domain/tache';

import * as TypeTâcheAbandon from '../typeTâcheAbandon.valueType';

import { TransmettrePreuveRecandidatureCommand } from './transmettrePreuveRecandidatureAbandon.command';

export type TransmettrePreuveRecandidatureAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
  {
    identifiantProjetValue: string;
    preuveRecandidatureValue: string;
    dateNotificationValue: string;
    identifiantUtilisateurValue: string;
    dateTransmissionPreuveRecandidatureValue: string;
  }
>;

export const registerTransmettrePreuveRecandidatureAbandonUseCase = () => {
  const runner: MessageHandler<TransmettrePreuveRecandidatureAbandonUseCase> = async ({
    identifiantProjetValue,
    preuveRecandidatureValue,
    identifiantUtilisateurValue,
    dateNotificationValue,
    dateTransmissionPreuveRecandidatureValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const preuveRecandidature = IdentifiantProjet.convertirEnValueType(preuveRecandidatureValue);

    const dateNotification = DateTime.convertirEnValueType(dateNotificationValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );

    const dateTransmissionPreuveRecandidature = DateTime.convertirEnValueType(
      dateTransmissionPreuveRecandidatureValue,
    );

    await mediator.send<TransmettrePreuveRecandidatureCommand>({
      type: 'Lauréat.Abandon.Command.TransmettrePreuveRecandidatureAbandon',
      data: {
        identifiantProjet,
        preuveRecandidature,
        dateNotification,
        identifiantUtilisateur,
        dateTransmissionPreuveRecandidature,
      },
    });

    await mediator.send<AcheverTâcheCommand>({
      type: 'System.Tâche.Command.AcheverTâche',
      data: {
        identifiantProjet,
        typeTâche: TypeTâcheAbandon.transmettrePreuveRecandidature.type,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon', runner);
};
