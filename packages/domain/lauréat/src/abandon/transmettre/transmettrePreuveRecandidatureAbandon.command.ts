import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';

import { loadAbandonFactory } from '../abandon.aggregate';

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
  loadAggregate: LoadAggregate,
) => {
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);
  const loadAbandon = loadAbandonFactory(loadAggregate);

  const handler: MessageHandler<TransmettrePreuveRecandidatureCommand> = async ({
    identifiantProjet,
    preuveRecandidature,
    identifiantUtilisateur,
    dateTransmissionPreuveRecandidature,
  }) => {
    const preuve = await loadCandidature(preuveRecandidature);
    const abandon = await loadAbandon(identifiantProjet);
    await abandon.transmettrePreuveRecandidature({
      identifiantProjet,
      preuveRecandidature,
      dateNotification: preuve.notifiéeLe,
      identifiantUtilisateur,
      dateTransmissionPreuveRecandidature,
    });
  };
  mediator.register('Lauréat.Abandon.Command.TransmettrePreuveRecandidatureAbandon', handler);
};
