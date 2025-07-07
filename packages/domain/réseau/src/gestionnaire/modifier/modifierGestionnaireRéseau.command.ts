import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { LoadAggregateV2 } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';

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
      identifiantGestionnaireRéseau,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
      contactEmail,
    });
  };

  mediator.register('Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau', handler);
};
