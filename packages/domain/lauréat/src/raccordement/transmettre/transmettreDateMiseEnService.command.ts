import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadLauréatFactory } from '../../lauréat.aggregate';

export type TransmettreDateMiseEnServiceCommand = Message<
  'Réseau.Raccordement.Command.TransmettreDateMiseEnService',
  {
    dateMiseEnService: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    transmiseLe: DateTime.ValueType;
    transmisePar: Email.ValueType;
  }
>;

export const registerTransmettreDateMiseEnServiceCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory(loadAggregate);
  const loadLauréatAggregate = loadLauréatFactory(loadAggregate);

  const handler: MessageHandler<TransmettreDateMiseEnServiceCommand> = async ({
    dateMiseEnService,
    référenceDossier,
    identifiantProjet,
    transmiseLe,
    transmisePar,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);
    const laureát = await loadLauréatAggregate(identifiantProjet);

    await raccordement.transmettreDateMiseEnService({
      dateDésignation: laureát.notifiéLe,
      dateMiseEnService,
      identifiantProjet,
      référenceDossier,
      transmiseLe,
      transmisePar,
    });
  };

  mediator.register('Réseau.Raccordement.Command.TransmettreDateMiseEnService', handler);
};
