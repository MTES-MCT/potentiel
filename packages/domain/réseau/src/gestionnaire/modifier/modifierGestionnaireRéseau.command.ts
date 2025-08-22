import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { Email, ExpressionRegulière } from '@potentiel-domain/common';
import type { LoadAggregateV2 } from '@potentiel-domain/core';
import type { Option } from '@potentiel-libraries/monads';

import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';
import type * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

export type ModifierGestionnaireRéseauCommand = Message<
  'Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: Option.Type<string>;
      légende: Option.Type<string>;
      expressionReguliere: Option.Type<ExpressionRegulière.ValueType>;
    };
    contactEmail: Option.Type<Email.ValueType>;
  }
>;

export const registerModifierGestionnaireRéseauCommand = (loadAggregate: LoadAggregateV2) => {
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
