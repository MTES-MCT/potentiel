// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, IdentifiantUtilisateur, DateTime } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

// Package
import { loadAbandonFactory } from '../abandon.aggregate';

export type AccorderAbandonCommand = Message<
  'ACCORDER_ABANDON_COMMAND',
  {
    dateAccord: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderAbandonCommand = (loadAggregate: LoadAggregate) => {
  const load = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<AccorderAbandonCommand> = async ({
    dateAccord,
    utilisateur,
    identifiantProjet,
    réponseSignée,
  }) => {
    const abandon = await load(identifiantProjet);

    await abandon.accorder({
      dateAccord,
      utilisateur,
      identifiantProjet,
      réponseSignée,
    });
  };
  mediator.register('ACCORDER_ABANDON_COMMAND', handler);
};
