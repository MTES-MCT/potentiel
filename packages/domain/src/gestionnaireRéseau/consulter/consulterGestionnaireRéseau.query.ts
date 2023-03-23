import { FindReadModel, QueryHandler } from '@potentiel/core-domain';
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
  return async ({ codeEIC }) => findGestionnaireRéseau(`gestionnaire-réseau#${codeEIC}`);
};
