import { Find, QueryHandler } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';

type ConsulterGestionnaireRéseauQuery = {
  codeEIC: string;
};

type ConsulterGestionnaireRéseauDependencies = {
  findGestionnaireRéseau: Find<GestionnaireRéseauReadModel>;
};

type ConsulterGestionnaireRéseauFactory = (
  dependencies: ConsulterGestionnaireRéseauDependencies,
) => QueryHandler<ConsulterGestionnaireRéseauQuery, GestionnaireRéseauReadModel>;

export const consulterGestionnaireRéseauQueryHandlerFactory: ConsulterGestionnaireRéseauFactory = ({
  findGestionnaireRéseau,
}) => {
  return async ({ codeEIC }) => {
    const result = await findGestionnaireRéseau(`gestionnaire-réseau#${codeEIC}`);

    if (isNone(result)) {
      throw new Error();
    }

    return result;
  };
};
