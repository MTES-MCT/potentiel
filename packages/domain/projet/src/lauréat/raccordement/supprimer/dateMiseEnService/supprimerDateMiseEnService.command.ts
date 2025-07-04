import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';
import { GetProjetAggregateRoot } from '../../../..';

export type SupprimerDateMiseEnServiceCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerDateMiseEnService',
  {
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    suppriméeLe: DateTime.ValueType;
    suppriméePar: Email.ValueType;
  }
>;

export const registerSupprimerDateMiseEnServiceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerDateMiseEnServiceCommand> = async ({
    référenceDossier,
    identifiantProjet,
    suppriméeLe,
    suppriméePar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.supprimerDateMiseEnService({
      référenceDossier,
      suppriméeLe,
      suppriméePar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDateMiseEnService', handler);
};
