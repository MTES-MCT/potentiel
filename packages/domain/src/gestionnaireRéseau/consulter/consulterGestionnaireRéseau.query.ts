import { Find, QueryHandlerFactory } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';
import { GestionnaireNonRéférencéError } from './gestionnaireNonRéférencé.error';

export type ConsulterGestionnaireRéseauQuery = {
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
      throw new GestionnaireNonRéférencéError();
    }

    return result;
  };
};
