import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type TransmettrePreuveRecandidatureCommand = Message<
  'Lauréat.Abandon.Command.TransmettrePreuveRecandidatureAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    preuveRecandidature: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
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
