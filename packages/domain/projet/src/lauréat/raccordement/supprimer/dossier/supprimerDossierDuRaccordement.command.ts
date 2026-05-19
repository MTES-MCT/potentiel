import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type SupprimerDossierDuRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
    suppriméLe: DateTime.ValueType;
    suppriméPar: Email.ValueType;
    rôle: Role.ValueType;
  }
>;

export const registerSupprimerDossierDuRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<SupprimerDossierDuRaccordementCommand> = async ({
    référenceDossier,
    identifiantProjet,
    suppriméLe,
    suppriméPar,
    rôle,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.supprimerDossier({
      référenceDossier,
      suppriméLe,
      suppriméPar,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.SupprimerDossierDuRaccordement', handler);
};
