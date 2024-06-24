import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

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
  };
  mediator.register('Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon', runner);
};
