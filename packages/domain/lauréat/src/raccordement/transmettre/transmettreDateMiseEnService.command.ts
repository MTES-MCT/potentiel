import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GetProjetAggregateRoot } from '@potentiel-domain/projet';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type TransmettreDateMiseEnServiceCommand = Message<
  'Lauréat.Raccordement.Command.TransmettreDateMiseEnService',
  {
    dateMiseEnService: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    transmiseLe: DateTime.ValueType;
    transmisePar: Email.ValueType;
  }
>;

export const registerTransmettreDateMiseEnServiceCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<TransmettreDateMiseEnServiceCommand> = async ({
    dateMiseEnService,
    référenceDossier,
    identifiantProjet,
    transmiseLe,
    transmisePar,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);
    const projet = await getProjetAggregateRoot(identifiantProjet);
    projet.lauréat.vérifierQueLeLauréatExiste();

    await raccordement.transmettreDateMiseEnService({
      dateDésignation: projet.candidature.notifiéeLe,
      dateMiseEnService,
      identifiantProjet,
      référenceDossier,
      transmiseLe,
      transmisePar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.TransmettreDateMiseEnService', handler);
};
