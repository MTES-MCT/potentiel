import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type SupprimerRaccordementCommand = Message<
  'Réseau.Raccordement.Command.SupprimerRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerSupprimerRaccordementCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<SupprimerRaccordementCommand> = async ({ identifiantProjet }) => {
    const raccordement = await loadRaccordement(identifiantProjet);
    await raccordement.supprimerRaccordement({
      identifiantProjet,
    });
  };

  mediator.register('Réseau.Raccordement.Command.SupprimerRaccordement', handler);
};
