import { Message, MessageHandler, mediator } from 'mediateur';
import { ExpressionRegulière } from '@potentiel-domain/common';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { Find } from '@potentiel-domain/core';
import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import { Option } from '@potentiel-libraries/monads';

export type ConsulterGestionnaireRéseauReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
};

export type ConsulterGestionnaireRéseauQuery = Message<
  'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: string;
  },
  Option.Type<ConsulterGestionnaireRéseauReadModel>
>;

export type ConsulterGestionnaireRéseauQueryDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauQuery = ({
  find,
}: ConsulterGestionnaireRéseauQueryDependencies) => {
  const handler: MessageHandler<ConsulterGestionnaireRéseauQuery> = async ({
    identifiantGestionnaireRéseau,
  }) => {
    const result = await find<GestionnaireRéseauEntity>(
      `gestionnaire-réseau|${identifiantGestionnaireRéseau}`,
    );

    return Option.isNone(result) ? Option.none : mapToReadModel(result);
  };

  mediator.register('Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau', handler);
};

const mapToReadModel = ({
  codeEIC,
  raisonSociale,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
}: GestionnaireRéseauEntity): ConsulterGestionnaireRéseauReadModel => {
  return {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format,
      légende,
      expressionReguliere: !expressionReguliere
        ? ExpressionRegulière.accepteTout
        : ExpressionRegulière.convertirEnValueType(expressionReguliere),
    },
  };
};
