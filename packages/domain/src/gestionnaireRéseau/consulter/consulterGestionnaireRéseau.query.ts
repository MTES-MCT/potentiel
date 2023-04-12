import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';

type ConsulterGestionnaireRéseauQuery = {
  codeEIC: string;
};

type ConsulterGestionnaireRéseauDependencies = {
  find: Find;
};

export const consulterGestionnaireRéseauQueryHandlerFactory: QueryHandlerFactory<
  ConsulterGestionnaireRéseauQuery,
  GestionnaireRéseauReadModel,
  ConsulterGestionnaireRéseauDependencies
> = ({ find }) => {
  return async ({ codeEIC }) => {
    const result = await find<GestionnaireRéseauReadModel>(`gestionnaire-réseau#${codeEIC}`);

    if (isNone(result)) {
      throw new Error();
    }

    return result;
  };
};
