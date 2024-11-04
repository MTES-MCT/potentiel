import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/laureat';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type TransmettreDateMiseEnServiceCommand = Message<
  'Réseau.Raccordement.Command.TransmettreDateMiseEnService',
  {
    dateMiseEnService: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerTransmettreDateMiseEnServiceCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory(loadAggregate);
  const loadLauréatAggregate = Lauréat.loadLauréatFactory(loadAggregate);

  const handler: MessageHandler<TransmettreDateMiseEnServiceCommand> = async ({
    dateMiseEnService,
    référenceDossier,
    identifiantProjet,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);
    const laureát = await loadLauréatAggregate(identifiantProjet);

    await raccordement.transmettreDateMiseEnService({
      dateDésignation: laureát.notifiéLe,
      dateMiseEnService,
      identifiantProjet,
      référenceDossier,
    });
  };

  mediator.register('Réseau.Raccordement.Command.TransmettreDateMiseEnService', handler);
};
