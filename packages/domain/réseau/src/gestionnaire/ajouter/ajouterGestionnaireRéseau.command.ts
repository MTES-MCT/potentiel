import { Message, MessageHandler, mediator } from 'mediateur';

import { Email, ExpressionRegulière } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';

export type AjouterGestionnaireRéseauCommand = Message<
  'Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau',
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

export const registerAjouterGestionnaireRéseauCommand = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<AjouterGestionnaireRéseauCommand> = async ({
    aideSaisieRéférenceDossierRaccordement,
    identifiantGestionnaireRéseau,
    raisonSociale,
    contactEmail,
  }) => {
    const gestionnaireRéseau = await loadAggregate(
      GestionnaireRéseauAggregate,
      `gestionnaire-réseau|${identifiantGestionnaireRéseau.formatter()}`,
      undefined,
    );

    await gestionnaireRéseau.ajouter({
      aideSaisieRéférenceDossierRaccordement,
      raisonSociale,
      contactEmail,
    });
  };

  mediator.register('Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau', handler);
};
