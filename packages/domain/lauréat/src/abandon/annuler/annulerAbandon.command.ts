import { Message, MessageHandler, mediator } from 'mediateur';

import {
  DateTime,
  IdentifiantProjet,
  IdentifiantUtilisateur,
  LoadAggregateDependencies,
} from '@potentiel-domain/common';
import { loadAbandonFactory } from '../abandon.aggregate';

export type AnnulerAbandonCommand = Message<
  'ANNULER_ABANDON_COMMAND',
  {
    dateAnnulation: DateTime.ValueType;
    utilisateur: IdentifiantUtilisateur.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAnnulerAbandonCommand = ({ loadAggregate }: LoadAggregateDependencies) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<AnnulerAbandonCommand> = async ({
    dateAnnulation,
    utilisateur,
    identifiantProjet,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);

    await abandon.annuler({
      dateAnnulation,
      identifiantProjet,
      utilisateur,
    });
  };
  mediator.register('ANNULER_ABANDON_COMMAND', handler);
};
