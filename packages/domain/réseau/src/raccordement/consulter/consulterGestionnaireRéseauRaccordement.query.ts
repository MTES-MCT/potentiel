import { ExpressionRegulière, IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Message, MessageHandler, mediator } from 'mediateur';
import { GestionnaireRéseauEntity, IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { RaccordementEntity } from '../raccordement.entity';

export type ConsulterGestionnaireRéseauRaccordementReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement?: {
    format: string;
    légende: string;
    expressionReguliere: ExpressionRegulière.ValueType;
  };
  contactEmail?: string;
};

export type ConsulterGestionnaireRéseauRaccordementQuery = Message<
  'Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
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

    if (Option.isNone(raccordementResult)) {
      return {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
        raisonSociale: IdentifiantGestionnaireRéseau.inconnu.formatter(),
      };
    }

    const gestionnaireRéseauResult = await find<GestionnaireRéseauEntity>(
      `gestionnaire-réseau|${raccordementResult.identifiantGestionnaireRéseau}`,
    );

    if (Option.isNone(gestionnaireRéseauResult)) {
      return {
        identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
        raisonSociale: IdentifiantGestionnaireRéseau.inconnu.formatter(),
      };
    }

    return mapToResult(gestionnaireRéseauResult);
  };

  mediator.register('Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement', handler);
};

const mapToResult = ({
  raisonSociale,
  codeEIC,
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  contactEmail,
}: GestionnaireRéseauEntity): ConsulterGestionnaireRéseauRaccordementReadModel => {
  return {
    raisonSociale,
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    aideSaisieRéférenceDossierRaccordement: {
      format,
      légende,
      expressionReguliere: ExpressionRegulière.convertirEnValueType(expressionReguliere || ''),
    },
    contactEmail,
  };
};
