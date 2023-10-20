import { Message, MessageHandler, mediator } from 'mediateur';

import {
  DateTime,
  IdentifiantProjet,
  IdentifiantUtilisateur,
  LoadAggregateDependencies,
} from '@potentiel-domain/common';

import { loadAbandonAggregateFactory } from '../abandon.aggregate';

export type AnnulerAbandonCommand = Message<
  'ANNULER_ABANDON_COMMAND',
  {
    dateAnnulation: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerAbandonCommand = (dependencies: LoadAggregateDependencies) => {
  const loadAbandonAggregate = loadAbandonAggregateFactory(dependencies);
  const handler: MessageHandler<AnnulerAbandonCommand> = async ({
    dateAnnulation,
    utilisateur,
    identifiantProjet,
  }) => {
    const abandon = await loadAbandonAggregate(identifiantProjet);

    await abandon.annuler({
      dateAnnulation,
      identifiantProjet,
      utilisateur,
    });
  };
  mediator.register('ANNULER_ABANDON_COMMAND', handler);
};
