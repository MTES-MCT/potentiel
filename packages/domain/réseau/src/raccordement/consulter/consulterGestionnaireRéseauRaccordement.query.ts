import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-libraries/projection';
import { RaccordementEntity } from '../raccordement.entity';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauProjection, IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { RaccordementInconnuError } from '../raccordementInconnu.error';

export type ConsulterGestionnaireRéseauRaccordementReadModel = {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  raisonSociale: string;
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
      throw new RaccordementInconnuError(identifiantProjet);
    }

    const gestionnaireRéseauResult = await find<GestionnaireRéseauProjection>(
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
}: GestionnaireRéseauProjection): ConsulterGestionnaireRéseauRaccordementReadModel => {
  return {
    raisonSociale,
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
  };
};
