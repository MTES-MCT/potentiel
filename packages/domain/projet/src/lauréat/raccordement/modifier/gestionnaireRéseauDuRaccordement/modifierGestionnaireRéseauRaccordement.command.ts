import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { Role } from '@potentiel-domain/utilisateur';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ModifierGestionnaireRéseauRaccordementCommand = Message<
  'Lauréat.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
  {
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    rôle: Role.ValueType;
  }
>;

export const registerModifierGestionnaireRéseauProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierGestionnaireRéseauRaccordementCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
    rôle,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierGestionnaireRéseau({
      identifiantGestionnaireRéseau,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierGestionnaireRéseauRaccordement', handler);
};
