import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { loadAbandonFactory } from '../abandon.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type ConfirmerAbandonCommand = Message<
  'Lauréat.Abandon.Command.ConfirmerAbandon',
  {
    dateConfirmation: DateTime.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerConfirmerAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<ConfirmerAbandonCommand> = async ({
    identifiantProjet,
    dateConfirmation,
    identifiantUtilisateur,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.confirmer({
      dateConfirmation,
      identifiantUtilisateur,
      identifiantProjet,
    });
  };
  mediator.register('Lauréat.Abandon.Command.ConfirmerAbandon', handler);
};
