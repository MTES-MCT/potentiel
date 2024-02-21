import { Message, MessageHandler, mediator } from 'mediateur';
import { ExpressionRegulière } from '@potentiel-domain/common';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { Find } from '@potentiel-domain/entity';
import { GestionnaireRéseauEntity } from '../gestionnaireRéseau.entity';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauInconnuError } from '../gestionnaireRéseauInconnu.error';

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
  'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
  {
    identifiantGestionnaireRéseau: string;
  },
  ConsulterGestionnaireRéseauReadModel
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

    if (isNone(result)) {
      throw new GestionnaireRéseauInconnuError();
    }

    return mapToReadModel(result);
  };

  mediator.register('CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY', handler);
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
      expressionReguliere: ExpressionRegulière.convertirEnValueType(expressionReguliere || ''),
    },
  };
};
