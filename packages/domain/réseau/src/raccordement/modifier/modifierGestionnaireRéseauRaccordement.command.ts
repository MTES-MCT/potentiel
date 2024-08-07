import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadGestionnaireRéseauFactory } from '../../gestionnaire/gestionnaireRéseau.aggregate';

export type ModifierGestionnaireRéseauRaccordementCommand = Message<
  'Réseau.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    rôle: Role.ValueType;
  }
>;

export const registerModifierGestionnaireRéseauProjetCommand = (loadAggregate: LoadAggregate) => {
  const loadGestionnaireRéseau = loadGestionnaireRéseauFactory(loadAggregate);
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<ModifierGestionnaireRéseauRaccordementCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
    rôle,
  }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseau(identifiantGestionnaireRéseau);
    const raccordement = await loadRaccordement(identifiantProjet);

    await raccordement.modifierGestionnaireRéseau({
      identifiantProjet,
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau,
      rôle,
    });
  };

  mediator.register('Réseau.Raccordement.Command.ModifierGestionnaireRéseauRaccordement', handler);
};
