import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadAbandonFactory } from '../abandon.aggregate';

export type AnnulerRejetAbandonCommand = Message<
  'ANNULER_REJET_ABANDON_COMMAND',
  {
    dateAnnulation: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerRejetAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<AnnulerRejetAbandonCommand> = async ({
    dateAnnulation,
    utilisateur,
    identifiantProjet,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.annulerRejet({
      dateAnnulation,
      identifiantProjet,
      utilisateur,
    });
  };
  mediator.register('ANNULER_REJET_ABANDON_COMMAND', handler);
};
