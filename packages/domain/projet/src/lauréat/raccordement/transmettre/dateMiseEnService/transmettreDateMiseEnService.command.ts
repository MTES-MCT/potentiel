import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot } from '../../../..';

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
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<TransmettreDateMiseEnServiceCommand> = async ({
    dateMiseEnService,
    référenceDossier,
    identifiantProjet,
    transmiseLe,
    transmisePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.transmettreDateMiseEnService({
      dateDésignation: projet.candidature.notifiéeLe,
      dateMiseEnService,
      référenceDossier,
      transmiseLe,
      transmisePar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.TransmettreDateMiseEnService', handler);
};
