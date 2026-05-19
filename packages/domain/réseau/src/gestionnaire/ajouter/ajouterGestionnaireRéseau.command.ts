import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { Email, ExpressionRegulière } from '@potentiel-domain/common';
import type { LoadAggregate } from '@potentiel-domain/core';

import { GestionnaireRéseauAggregate } from '../gestionnaireRéseau.aggregate.js';
import type * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType.js';

export type AjouterGestionnaireRéseauCommand = Message<
  'Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau',
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
