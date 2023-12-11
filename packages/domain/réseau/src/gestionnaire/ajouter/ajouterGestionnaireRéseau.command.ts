import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate } from '@potentiel-domain/core';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { loadGestionnaireRéseauFactory } from '../gestionnaireRéseau.aggregate';

export type AjouterGestionnaireRéseauCommand = Message<
  'AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND',
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

export const registerAjouterGestionnaireRéseauCommand = (loadAggregate: LoadAggregate) => {
  const load = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<AjouterGestionnaireRéseauCommand> = async ({
    aideSaisieRéférenceDossierRaccordement,
    identifiantGestionnaireRéseau,
    raisonSociale,
  }) => {
    const gestionnaireRéseau = await load(identifiantGestionnaireRéseau, false);

    await gestionnaireRéseau.ajouter({
      aideSaisieRéférenceDossierRaccordement,
      identifiantGestionnaireRéseau,
      raisonSociale,
    });
  };

  mediator.register('AJOUTER_GESTIONNAIRE_RÉSEAU_COMMAND', handler);
};
