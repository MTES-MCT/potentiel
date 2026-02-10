import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../../../index.js';

import { TransmettrePreuveRecandidatureCommand } from './transmettrePreuveRecandidatureAbandon.command.js';

export type TransmettrePreuveRecandidatureAbandonUseCase = Message<
  'Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon',
  {
    identifiantProjetValue: string;
    preuveRecandidatureValue: string;
    identifiantUtilisateurValue: string;
    dateTransmissionPreuveRecandidatureValue: string;
  }
>;

export const registerTransmettrePreuveRecandidatureAbandonUseCase = () => {
  const runner: MessageHandler<TransmettrePreuveRecandidatureAbandonUseCase> = async ({
    identifiantProjetValue,
    preuveRecandidatureValue,
    identifiantUtilisateurValue,
    dateTransmissionPreuveRecandidatureValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const preuveRecandidature = IdentifiantProjet.convertirEnValueType(preuveRecandidatureValue);

    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const dateTransmissionPreuveRecandidature = DateTime.convertirEnValueType(
      dateTransmissionPreuveRecandidatureValue,
    );

    await mediator.send<TransmettrePreuveRecandidatureCommand>({
      type: 'Lauréat.Abandon.Command.TransmettrePreuveRecandidatureAbandon',
      data: {
        identifiantProjet,
        preuveRecandidature,
        identifiantUtilisateur,
        dateTransmissionPreuveRecandidature,
      },
    });
  };
  mediator.register('Lauréat.Abandon.UseCase.TransmettrePreuveRecandidatureAbandon', runner);
};
