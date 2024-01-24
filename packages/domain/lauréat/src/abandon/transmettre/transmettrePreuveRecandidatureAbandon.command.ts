import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { loadAbandonFactory } from '../abandon.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type TransmettrePreuveRecandidatureCommand = Message<
  'TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    preuveRecandidature: IdentifiantProjet.ValueType;
    dateNotification: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    dateTransmissionPreuveRecandidature: DateTime.ValueType;
  }
>;

export const registerTransmettrePreuveRecandidatureAbandonCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<TransmettrePreuveRecandidatureCommand> = async ({
    identifiantProjet,
    preuveRecandidature,
    dateNotification,
    identifiantUtilisateur,
    dateTransmissionPreuveRecandidature,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);
    await abandon.transmettrePreuveRecandidature({
      identifiantProjet,
      preuveRecandidature,
      dateNotification,
      identifiantUtilisateur,
      dateTransmissionPreuveRecandidature,
    });
  };
  mediator.register('TRANSMETTRE_PREUVE_RECANDIDATURE_ABANDON_COMMAND', handler);
};
