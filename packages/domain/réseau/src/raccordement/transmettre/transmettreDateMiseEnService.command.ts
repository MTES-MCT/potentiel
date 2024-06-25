import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type TransmettreDateMiseEnServiceCommand = Message<
  'Réseau.Raccordement.Command.TransmettreDateMiseEnService',
  {
    dateMiseEnService: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    dateDésignation: DateTime.ValueType;
  }
>;

export const registerTransmettreDateMiseEnServiceCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<TransmettreDateMiseEnServiceCommand> = async ({
    dateMiseEnService,
    référenceDossier,
    identifiantProjet,
    dateDésignation,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    await raccordement.transmettreDateMiseEnService({
      dateDésignation,
      dateMiseEnService,
      identifiantProjet,
      référenceDossier,
    });
  };

  mediator.register('Réseau.Raccordement.Command.TransmettreDateMiseEnService', handler);
};
