import { Message, MessageHandler, mediator } from 'mediateur';
import {
  DateTime,
  IdentifiantProjet,
  IdentifiantUtilisateur,
  LoadAggregateDependencies,
} from '@potentiel-domain/common';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type ConfirmerAbandonCommand = Message<
  'CONFIRMER_ABANDON_COMMAND',
  {
    dateConfirmation: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerConfirmerAbandonCommand = (dependencies: LoadAggregateDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory(dependencies);
  const handler: MessageHandler<ConfirmerAbandonCommand> = async ({
    identifiantProjet,
    dateConfirmation,
    utilisateur,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.confirmer({
      dateConfirmation,
      utilisateur,
      identifiantProjet,
    });
  };
  mediator.register('CONFIRMER_ABANDON_COMMAND', handler);
};
