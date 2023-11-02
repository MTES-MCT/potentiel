import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { loadAbandonFactory } from '../abandon.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type ConfirmerAbandonCommand = Message<
  'CONFIRMER_ABANDON_COMMAND',
  {
    dateConfirmation: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerConfirmerAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<ConfirmerAbandonCommand> = async ({
    identifiantProjet,
    dateConfirmation,
    utilisateur,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.confirmer({
      dateConfirmation,
      utilisateur,
      identifiantProjet,
    });
  };
  mediator.register('CONFIRMER_ABANDON_COMMAND', handler);
};
