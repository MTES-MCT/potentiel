import { Message, MessageHandler, mediator } from 'mediateur';
import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-libraries/projection';
import { RaccordementEntity } from '../raccordement.entity';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauProjection, IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { GestionnaireRéseauReadModel } from '../../gestionnaire.readmodel';

export type ConsulterGestionnaireRéseauRaccordementReadModel = GestionnaireRéseauReadModel;

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
        aideSaisieRéférenceDossierRaccordement: {
          format: '',
          légende: '',
          expressionReguliere: ExpressionRegulière.convertirEnValueType(''),
        },
      };
    }

    const gestionnaireRéseauResult = await find<GestionnaireRéseauProjection>(
      `gestionnaire-réseau|${raccordementResult.identifiantGestionnaireRéseau}`,
    );

    if (isNone(gestionnaireRéseauResult)) {
      return {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
        raisonSociale: IdentifiantGestionnaireRéseau.inconnu.formatter(),
        aideSaisieRéférenceDossierRaccordement: {
          format: '',
          légende: '',
          expressionReguliere: ExpressionRegulière.convertirEnValueType(''),
        },
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
}: GestionnaireRéseauProjection): ConsulterGestionnaireRéseauRaccordementReadModel => {
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
