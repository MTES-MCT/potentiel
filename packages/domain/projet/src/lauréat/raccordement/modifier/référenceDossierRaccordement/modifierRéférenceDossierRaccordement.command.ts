import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';
import type * as RéférenceDossierRaccordement from '../../référenceDossierRaccordement.valueType.js';

export type ModifierRéférenceDossierRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierRéférenceDossierRaccordement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.ValueType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
    rôle: Role.ValueType;
    modifiéeLe: DateTime.ValueType;
    modifiéePar: Email.ValueType;
  }
>;

export const registerModifierRéférenceDossierRaccordementCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierRéférenceDossierRaccordementCommand> = async ({
    nouvelleRéférenceDossierRaccordement,
    référenceDossierRaccordementActuelle,
    modifiéeLe,
    modifiéePar,
    rôle,
    identifiantProjet,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierRéférenceDossierRacordement({
      nouvelleRéférenceDossierRaccordement,
      référenceDossierRaccordementActuelle,
      modifiéeLe,
      modifiéePar,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierRéférenceDossierRaccordement', handler);
};
