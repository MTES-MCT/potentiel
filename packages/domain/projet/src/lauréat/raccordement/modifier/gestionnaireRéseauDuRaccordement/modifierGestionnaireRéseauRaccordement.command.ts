import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { GetProjetAggregateRoot } from '../../../..';

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
  loadAggregate: LoadAggregate,
) => {
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierGestionnaireRéseauRaccordementCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
    rôle,
  }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseau(identifiantGestionnaireRéseau);
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.modifierGestionnaireRéseau({
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau,
      rôle,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.ModifierGestionnaireRéseauRaccordement', handler);
};
