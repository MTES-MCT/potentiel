import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot } from '../../../..';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType';

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
