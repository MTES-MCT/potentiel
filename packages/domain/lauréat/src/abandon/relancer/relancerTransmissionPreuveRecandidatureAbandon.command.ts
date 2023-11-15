import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { loadAbandonFactory } from '../abandon.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type RelancerTransmissionPreuveRecandidatureCommand = Message<
  'RELANCER_TRANSMISSION_PREUVE_RECANDIDATURE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateRelance: DateTime.ValueType;
  }
>;

export const registerRelancerTransmissionPreuveRecandidatureCommand = (
  loadAggregate: LoadAggregate,
) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<RelancerTransmissionPreuveRecandidatureCommand> = async ({
    identifiantProjet,
    dateRelance,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);
    await abandon.relancerTransmissionPreuveRecandidature({
      identifiantProjet,
      dateRelance,
    });
  };
  mediator.register('RELANCER_TRANSMISSION_PREUVE_RECANDIDATURE_COMMAND', handler);
};
