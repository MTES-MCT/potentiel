import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { loadAbandonFactory } from '../abandon.aggregate';

export type RejeterAbandonCommand = Message<
  'REJETER_ABANDON_COMMAND',
  {
    dateRejet: DateTime.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerRejeterAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<RejeterAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateRejet,
    identifiantUtilisateur,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.rejeter({
      dateRejet,
      identifiantProjet,
      identifiantUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('REJETER_ABANDON_COMMAND', handler);
};
