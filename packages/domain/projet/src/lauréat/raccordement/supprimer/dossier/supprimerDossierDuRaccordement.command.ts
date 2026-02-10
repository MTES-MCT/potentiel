import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';
import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

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
