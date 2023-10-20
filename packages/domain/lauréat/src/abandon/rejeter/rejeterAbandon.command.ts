import { Message, MessageHandler, mediator } from 'mediateur';

import {
  DateTime,
  IdentifiantProjet,
  IdentifiantUtilisateur,
  LoadAggregateDependencies,
} from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type RejeterAbandonCommand = Message<
  'REJETER_ABANDON_COMMAND',
  {
    dateRejet: DateTime.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
  }
>;

export const registerRejeterAbandonCommand = (dependencies: LoadAggregateDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory(dependencies);
  const handler: MessageHandler<RejeterAbandonCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateRejet,
    utilisateur,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.rejeter({
      dateRejet,
      identifiantProjet,
      utilisateur,
      réponseSignée,
    });
  };
  mediator.register('REJETER_ABANDON_COMMAND', handler);
};
