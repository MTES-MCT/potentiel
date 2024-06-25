import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadGestionnaireRéseauFactory } from '../../gestionnaire/gestionnaireRéseau.aggregate';

export type ModifierGestionnaireRéseauRaccordementCommand = Message<
  'Réseau.Raccordement.Command.ModifierGestionnaireRéseauRaccordement',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerModifierGestionnaireRéseauProjetCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory(loadAggregate);
  const loadGestionnaireRéseau = loadGestionnaireRéseauFactory(loadAggregate);
  const handler: MessageHandler<ModifierGestionnaireRéseauRaccordementCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);
    const gestionnaireRéseau = await loadGestionnaireRéseau(identifiantGestionnaireRéseau);

    await raccordement.modifierGestionnaireRéseau({
      identifiantProjet,
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau,
    });
  };

  mediator.register('Réseau.Raccordement.Command.ModifierGestionnaireRéseauRaccordement', handler);
};
