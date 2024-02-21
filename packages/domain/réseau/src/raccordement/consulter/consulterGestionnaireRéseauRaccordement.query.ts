import { Message, MessageHandler, mediator } from 'mediateur';
import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/entity';
import { RaccordementEntity } from '../raccordement.entity';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauEntity, IdentifiantGestionnaireRéseau } from '../../gestionnaire';

export type ConsulterGestionnaireRéseauRaccordementReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement?: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
};

export type ConsulterGestionnaireRéseauRaccordementQuery = Message<
  'CONSULTER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_QUERY',
  {
    identifiantProjetValue: string;
  },
  ConsulterGestionnaireRéseauRaccordementReadModel
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

    if (isNone(raccordementResult)) {
      return {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
        raisonSociale: IdentifiantGestionnaireRéseau.inconnu.formatter(),
      };
    }

    const gestionnaireRéseauResult = await find<GestionnaireRéseauEntity>(
      `gestionnaire-réseau|${raccordementResult.identifiantGestionnaireRéseau}`,
    );

    if (isNone(gestionnaireRéseauResult)) {
      return {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
        raisonSociale: IdentifiantGestionnaireRéseau.inconnu.formatter(),
      };
    }

    return mapToResult(gestionnaireRéseauResult);
  };

  mediator.register('CONSULTER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_QUERY', handler);
};

const mapToResult = ({
  raisonSociale,
  codeEIC,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
}: GestionnaireRéseauEntity): ConsulterGestionnaireRéseauRaccordementReadModel => {
  return {
    raisonSociale,
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    aideSaisieRéférenceDossierRaccordement: {
      format,
      légende,
      expressionReguliere: ExpressionRegulière.convertirEnValueType(expressionReguliere || ''),
    },
  };
};
