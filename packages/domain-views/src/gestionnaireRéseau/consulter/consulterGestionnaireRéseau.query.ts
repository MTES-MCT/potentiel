import { Message, MessageHandler, mediator } from 'mediateur';
import { NotFoundError } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  GestionnaireRéseauReadModel,
} from '../gestionnaireRéseau.readModel';
import { Find } from '../../common.port';
import {
  IdentifiantGestionnaireRéseau,
  RawIdentifiantGestionnaireRéseau,
  convertirEnIdentifiantGestionnaireRéseau,
} from '@potentiel/domain';

export type ConsulterGestionnaireRéseauQuery = Message<
  'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
  {
    identifiantGestionnaireRéseau: RawIdentifiantGestionnaireRéseau | IdentifiantGestionnaireRéseau;
  },
  GestionnaireRéseauReadModel
>;

export type ConsulterGestionnaireRéseauDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauQuery = ({
  find,
}: ConsulterGestionnaireRéseauDependencies) => {
  const handler: MessageHandler<ConsulterGestionnaireRéseauQuery> = async ({
    identifiantGestionnaireRéseau,
  }) => {
    const identifiantFormatté = convertirEnIdentifiantGestionnaireRéseau(
      identifiantGestionnaireRéseau,
    ).formatter();
    const result = await find<GestionnaireRéseauReadModel>(
      `gestionnaire-réseau#${identifiantFormatté}`,
    );

    if (isNone(result)) {
      throw new NotFoundError(`Le gestionnaire de réseau n'est pas référencé`);
    }

    return result;
  };

  mediator.register('CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY', handler);
};
