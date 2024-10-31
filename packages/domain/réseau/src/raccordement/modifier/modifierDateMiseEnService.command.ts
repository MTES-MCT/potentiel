import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/laureat';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type ModifierDateMiseEnServiceCommand = Message<
  'Réseau.Raccordement.Command.ModifierDateMiseEnService',
  {
    dateMiseEnService: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerModifierDateMiseEnServiceCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory(loadAggregate);
  const loadLauréatAggregate = Lauréat.loadLauréatFactory(loadAggregate);

  const handler: MessageHandler<ModifierDateMiseEnServiceCommand> = async ({
    dateMiseEnService,
    référenceDossier,
    identifiantProjet,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);
    const laureát = await loadLauréatAggregate(identifiantProjet);

    await raccordement.modifierDateMiseEnService({
      dateDésignation: laureát.notifiéLe,
      dateMiseEnService,
      identifiantProjet,
      référenceDossier,
    });
  };

  mediator.register('Réseau.Raccordement.Command.ModifierDateMiseEnService', handler);
};
