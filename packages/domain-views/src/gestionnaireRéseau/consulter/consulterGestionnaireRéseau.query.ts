import { Message, MessageHandler, mediator } from 'mediateur';
import { Find, NotFoundError } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  GestionnaireRéseauReadModel,
  GestionnaireRéseauReadModelKey,
} from '../gestionnaireRéseau.readModel';

export type ConsulterGestionnaireRéseauQuery = Message<
  'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
  {
    codeEIC: string;
  },
  GestionnaireRéseauReadModel
>;

export type ConsulterGestionnaireRéseauDependencies = {
  find: Find;
};

export const registerConsulterGestionnaireRéseauQuery = ({
  find,
}: ConsulterGestionnaireRéseauDependencies) => {
  const handler: MessageHandler<ConsulterGestionnaireRéseauQuery> = async ({ codeEIC }) => {
    const key: GestionnaireRéseauReadModelKey = `gestionnaire-réseau#${codeEIC}`;
    const result = await find<GestionnaireRéseauReadModel>(key);

    if (isNone(result)) {
      throw new NotFoundError(`Le gestionnaire de réseau n'est pas référencé`);
    }

    return result;
  };

  mediator.register('CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY', handler);
};
