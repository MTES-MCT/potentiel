import { ExpressionRegulière } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import { loadGestionnaireRéseauFactory } from '../gestionnaireRéseau.aggregate';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

export type AjouterGestionnaireRéseauCommand = Message<
  'Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: ExpressionRegulière.ValueType;
    };
    contactEmail: Option.Type<IdentifiantUtilisateur.ValueType>;
  }
>;

export const registerAjouterGestionnaireRéseauCommand = (loadAggregate: LoadAggregate) => {
  const load = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<AjouterGestionnaireRéseauCommand> = async ({
    aideSaisieRéférenceDossierRaccordement,
    identifiantGestionnaireRéseau,
    raisonSociale,
    contactEmail,
  }) => {
    const gestionnaireRéseau = await load(identifiantGestionnaireRéseau, false);

    await gestionnaireRéseau.ajouter({
      aideSaisieRéférenceDossierRaccordement,
      identifiantGestionnaireRéseau,
      raisonSociale,
      contactEmail,
    });
  };

  mediator.register('Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau', handler);
};
