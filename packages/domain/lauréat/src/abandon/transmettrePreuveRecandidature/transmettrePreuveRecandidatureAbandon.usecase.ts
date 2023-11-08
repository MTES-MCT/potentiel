import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { TransmettrePreuveRecandidatureCommand } from './transmettrePreuveRecandidatureAbandon.command';

export type TransmettrePreuveRecandidatureAbandonUseCase = Message<
  'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
  {
    identifiantProjetValue: string;
    preuveRecandidatureValue: string;
    dateNotificationValue: string;
    utilisateurValue: string;
  }
>;

export const registerTransmettrePreuveRecandidatureAbandonUseCase = () => {
  const runner: MessageHandler<TransmettrePreuveRecandidatureAbandonUseCase> = async ({
    identifiantProjetValue,
    preuveRecandidatureValue,
    utilisateurValue,
    dateNotificationValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const preuveRecandidature = IdentifiantProjet.convertirEnValueType(preuveRecandidatureValue);

    const dateNotification = DateTime.convertirEnValueType(dateNotificationValue);
    const utilisateur = IdentifiantUtilisateur.convertirEnValueType(utilisateurValue);
    await mediator.send<TransmettrePreuveRecandidatureCommand>({
      type: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_COMMAND',
      data: {
        identifiantProjet,
        preuveRecandidature,
        dateNotification,
        utilisateur,
      },
    });
  };
  mediator.register('TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE', runner);
};
