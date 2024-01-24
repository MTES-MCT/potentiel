import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { TransmettrePreuveRecandidatureCommand } from './transmettrePreuveRecandidatureAbandon.command';

export type TransmettrePreuveRecandidatureAbandonUseCase = Message<
  'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE',
  {
    identifiantProjetValue: string;
    preuveRecandidatureValue: string;
    dateNotificationValue: string;
    identifiantUtilisateurValue: string;
    dateTransmissionPreuveRecandidature: string;
  }
>;

export const registerTransmettrePreuveRecandidatureAbandonUseCase = () => {
  const runner: MessageHandler<TransmettrePreuveRecandidatureAbandonUseCase> = async ({
    identifiantProjetValue,
    preuveRecandidatureValue,
    identifiantUtilisateurValue,
    dateNotificationValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const preuveRecandidature = IdentifiantProjet.convertirEnValueType(preuveRecandidatureValue);

    const dateNotification = DateTime.convertirEnValueType(dateNotificationValue);
    const identifiantUtilisateur = IdentifiantUtilisateur.convertirEnValueType(
      identifiantUtilisateurValue,
    );
    await mediator.send<TransmettrePreuveRecandidatureCommand>({
      type: 'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_COMMAND',
      data: {
        identifiantProjet,
        preuveRecandidature,
        dateNotification,
        identifiantUtilisateur,
      },
    });
  };
  mediator.register('TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_USECASE', runner);
};
