import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { Email, ExpressionRegulière } from '@potentiel-domain/common';
import type { LoadAggregateV2 } from '@potentiel-domain/core';
import type { Option } from '@potentiel-libraries/monads';

import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate';
import type * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

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

export const registerAjouterGestionnaireRéseauCommand = (loadAggregate: LoadAggregateV2) => {
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
