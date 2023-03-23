import { FindReadModel, QueryHandler } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { ConsulterGestionnaireRéseauReadModel } from './consulterGestionnaireRéseau.readModel';

type ConsulterGestionnaireRéseauQuery = {
  codeEIC: string;
};

type ConsulterGestionnaireRéseauDependencies = {
  findGestionnaireRéseau: FindReadModel<ConsulterGestionnaireRéseauReadModel>;
};

type ConsulterGestionnaireRéseauFactory = (
  dependencies: ConsulterGestionnaireRéseauDependencies,
) => QueryHandler<ConsulterGestionnaireRéseauQuery, ConsulterGestionnaireRéseauReadModel>;

export const consulterGestionnaireRéseauFactory: ConsulterGestionnaireRéseauFactory = ({
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
