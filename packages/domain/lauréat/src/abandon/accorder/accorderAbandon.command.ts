// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import {
  IdentifiantProjet,
  IdentifiantUtilisateur,
  DateTime,
  LoadAggregateDependencies,
} from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

// Package
import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type AccorderAbandonCommand = Message<
  'ACCORDER_ABANDON_COMMAND',
  {
    dateAccord: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderAbandonCommand = (dependencies: LoadAggregateDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory(dependencies);
  const handler: MessageHandler<AccorderAbandonCommand> = async ({
    dateAccord,
    utilisateur,
    identifiantProjet,
    réponseSignée,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.accorder({
      dateAccord,
      utilisateur,
      identifiantProjet,
      réponseSignée,
    });
  };
  mediator.register('ACCORDER_ABANDON_COMMAND', handler);
};
