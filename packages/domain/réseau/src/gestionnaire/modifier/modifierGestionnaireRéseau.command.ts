import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { Email, ExpressionRegulière } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate.js';
import type * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType.js';

export type ModifierGestionnaireRéseauCommand = Message<
  'Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format?: string;
      légende?: string;
      expressionReguliere?: ExpressionRegulière.ValueType;
    };
    contactEmail?: Email.ValueType;
  }
>;

export const registerModifierGestionnaireRéseauCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<ModifierGestionnaireRéseauCommand> = async ({
    identifiantGestionnaireRéseau,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
    contactEmail,
  }) => {
    const gestionnaireRéseau = await loadAggregate(
      GestionnaireRéseauAggregate,
      `gestionnaire-réseau|${identifiantGestionnaireRéseau.formatter()}`,
      undefined,
    );
    await gestionnaireRéseau.modifier({
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
      contactEmail,
    });
  };

  mediator.register('Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau', handler);
};
