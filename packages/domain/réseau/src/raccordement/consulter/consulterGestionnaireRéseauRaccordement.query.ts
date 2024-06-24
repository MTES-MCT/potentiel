import { Message, MessageHandler, mediator } from 'mediateur';

import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';

import { GestionnaireRéseauEntity, IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { RaccordementEntity } from '../raccordement.entity';
import { mapToReadModel } from '../../gestionnaire/consulter/consulterGestionnaireRéseau.query';

export type ConsulterGestionnaireRéseauRaccordementReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: Option.Type<string>;
    légende: Option.Type<string>;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
  contactEmail: Option.Type<IdentifiantUtilisateur.ValueType>;
};

export type ConsulterGestionnaireRéseauRaccordementQuery = Message<
  'Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterGestionnaireRéseauRaccordementReadModel>
>;

export type ConsulterGestionnaireRéseauRaccordementDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauRaccordementQuery = ({
  find,
}: ConsulterGestionnaireRéseauRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterGestionnaireRéseauRaccordementQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const raccordementResult = await find<RaccordementEntity>(
      `raccordement|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(raccordementResult)) {
      return Option.none;
    }

    const gestionnaireRéseauResult = await find<GestionnaireRéseauEntity>(
      `gestionnaire-réseau|${raccordementResult.identifiantGestionnaireRéseau}`,
    );

    return Option.match(gestionnaireRéseauResult)
      .some((grd) => mapToReadModel(grd))
      .none();
  };

  mediator.register('Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement', handler);
};
