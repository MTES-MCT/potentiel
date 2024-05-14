import { Message, MessageHandler, mediator } from 'mediateur';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { loadGestionnaireRéseauFactory } from '../gestionnaireRéseau.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';
import { ExpressionRegulière } from '@potentiel-domain/common';

export type ModifierGestionnaireRéseauCommand = Message<
  'Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: ExpressionRegulière.ValueType;
    };
    contactInformations?: {
      email?: string;
      phone?: string;
    };
  }
>;

export const registerModifierGestionnaireRéseauCommand = (loadAggregate: LoadAggregate) => {
  const load = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierGestionnaireRéseauCommand> = async ({
    identifiantGestionnaireRéseau,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
    contactInformations,
  }) => {
    const gestionnaireRéseau = await load(identifiantGestionnaireRéseau);

    await gestionnaireRéseau.modifier({
      identifiantGestionnaireRéseau,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
      contactInformations,
    });
  };

  mediator.register('Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau', handler);
};
