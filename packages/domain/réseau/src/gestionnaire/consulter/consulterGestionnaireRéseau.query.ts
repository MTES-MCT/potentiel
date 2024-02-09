import { Message, MessageHandler, mediator } from 'mediateur';
import { ExpressionRegulière } from '@potentiel-domain/common';
import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';
import { Find } from '@potentiel-libraries/projection';
import { GestionnaireRéseauProjection } from '../gestionnaireRéseau.projection';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauInconnuError } from '../gestionnaireRéseauInconnu.error';
import { GestionnaireRéseauReadModel } from '../../gestionnaire.readmodel';

export type ConsulterGestionnaireRéseauReadModel = GestionnaireRéseauReadModel;

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
    const result = await find<GestionnaireRéseauProjection>(
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
}: GestionnaireRéseauProjection): ConsulterGestionnaireRéseauReadModel => {
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
