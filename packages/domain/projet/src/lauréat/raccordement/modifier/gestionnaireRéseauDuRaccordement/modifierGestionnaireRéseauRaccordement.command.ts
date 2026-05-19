import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../../index.js';

export type ModifierGestionnaireRéseauRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
  {
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    rôle: Role.ValueType;
    modifiéPar: Email.ValueType;
    modifiéLe: DateTime.ValueType;
  }
>;

export const registerModifierGestionnaireRéseauProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierGestionnaireRéseauRaccordementCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
    rôle,
    modifiéLe,
    modifiéPar,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierGestionnaireRéseau({
      identifiantGestionnaireRéseau,
      rôle,
      modifiéLe,
      modifiéPar,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierGestionnaireRéseauRaccordement', handler);
};
