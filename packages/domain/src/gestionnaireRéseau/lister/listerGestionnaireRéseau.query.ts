import { QueryHandler , List } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';

type ListerGestionnaireRéseauDependencies = {
  listGestionnaireRéseau: List<GestionnaireRéseauReadModel>;
};

type ListerGestionnaireRéseauFactory = (
  dependencies: ListerGestionnaireRéseauDependencies,
) => QueryHandler<{}, ReadonlyArray<GestionnaireRéseauReadModel>>;

export const listerGestionnaireRéseauQueryHandlerFactory: ListerGestionnaireRéseauFactory = ({
  listGestionnaireRéseau,
}) => {
  return async () => {
    const result = await listGestionnaireRéseau({ type: 'gestionnaire-réseau' });
    return result;
  };
};
