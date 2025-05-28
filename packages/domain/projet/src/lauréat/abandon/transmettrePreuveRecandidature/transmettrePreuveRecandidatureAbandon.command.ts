import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GetProjetAggregateRoot } from '../../..';

export type TransmettrePreuveRecandidatureCommand = Message<
  'Lauréat.Abandon.Command.TransmettrePreuveRecandidatureAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    preuveRecandidature: IdentifiantProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    dateTransmissionPreuveRecandidature: DateTime.ValueType;
  }
>;

export const registerTransmettrePreuveRecandidatureAbandonCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettrePreuveRecandidatureCommand> = async ({
    identifiantProjet,
    preuveRecandidature,
    identifiantUtilisateur,
    dateTransmissionPreuveRecandidature,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    const preuve = await getProjetAggregateRoot(preuveRecandidature);

    await projet.lauréat.abandon.transmettrePreuveRecandidature({
      preuveRecandidature: preuve,
      identifiantUtilisateur,
      dateTransmissionPreuveRecandidature,
    });
  };
  mediator.register('Lauréat.Abandon.Command.TransmettrePreuveRecandidatureAbandon', handler);
};
