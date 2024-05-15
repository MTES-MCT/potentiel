import { Message, MessageHandler, mediator } from 'mediateur';

import { ExpressionRegulière } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { loadGestionnaireRéseauFactory } from '../gestionnaireRéseau.aggregate';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import * as ContactEmailGestionnaireRéseau from '../contactEmailGestionnaireRéseau.valueType';
import { Option } from '@potentiel-libraries/monads';

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
    contactEmail: Option.Type<ContactEmailGestionnaireRéseau.ValueType>;
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
