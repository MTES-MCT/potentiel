import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type SupprimerDateMiseEnServiceCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerDateMiseEnService',
  {
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    suppriméeLe: DateTime.ValueType;
    suppriméePar: Email.ValueType;
  }
>;

export const registerSupprimerDateMiseEnServiceCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<SupprimerDateMiseEnServiceCommand> = async ({
    référenceDossier,
    identifiantProjet,
    suppriméeLe,
    suppriméePar,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    await raccordement.supprimerDateMiseEnService({
      identifiantProjet,
      référenceDossier,
      suppriméeLe,
      suppriméePar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDateMiseEnService', handler);
};
