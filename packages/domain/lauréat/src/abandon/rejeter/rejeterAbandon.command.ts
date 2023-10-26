import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet, IdentifiantUtilisateur } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { loadAbandonFactory } from '../abandon.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type RejeterAbandonCommand = Message<
  'REJETER_ABANDON_COMMAND',
  {
    dateRejet: DateTime.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerRejeterAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<RejeterAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateRejet,
    utilisateur,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.rejeter({
      dateRejet,
      identifiantProjet,
      utilisateur,
      réponseSignée,
    });
  };
  mediator.register('REJETER_ABANDON_COMMAND', handler);
};
