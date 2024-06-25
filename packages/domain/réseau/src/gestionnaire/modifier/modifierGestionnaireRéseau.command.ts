import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import { loadGestionnaireRéseauFactory } from '../gestionnaireRéseau.aggregate';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

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

export const registerModifierGestionnaireRéseauCommand = (loadAggregate: LoadAggregate) => {
  const load = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<ModifierGestionnaireRéseauCommand> = async ({
    identifiantGestionnaireRéseau,
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement,
    contactEmail,
  }) => {
    const gestionnaireRéseau = await load(identifiantGestionnaireRéseau);

    await gestionnaireRéseau.modifier({
      identifiantGestionnaireRéseau,
      raisonSociale,
      aideSaisieRéférenceDossierRaccordement,
      contactEmail,
    });
  };

  mediator.register('Réseau.Gestionnaire.Command.ModifierGestionnaireRéseau', handler);
};
