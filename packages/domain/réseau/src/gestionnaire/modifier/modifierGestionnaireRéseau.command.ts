import { Message, MessageHandler, mediator } from 'mediateur';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { loadGestionnaireRéseauFactory } from '../gestionnaireRéseau.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type ModifierGestionnaireRéseauCommand = Message<
  'MODIFIER_GESTIONNAIRE_RÉSEAU_COMMAND',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }
>;

export const registerModifierGestionnaireRéseauCommand = (loadAggregate: LoadAggregate) => {
  const load = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierGestionnaireRéseauCommand> = async ({
    identifiantGestionnaireRéseau,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
  }) => {
    const gestionnaireRéseau = await load(identifiantGestionnaireRéseau);

    await gestionnaireRéseau.modifier({
      identifiantGestionnaireRéseau,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
    });
  };

  mediator.register('MODIFIER_GESTIONNAIRE_RÉSEAU_COMMAND', handler);
};
