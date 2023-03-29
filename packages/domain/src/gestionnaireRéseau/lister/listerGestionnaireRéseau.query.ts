import { QueryHandlerFactory, List } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';

type ListerGestionnaireRéseauDependencies = {
  listGestionnaireRéseau: List<GestionnaireRéseauReadModel>;
};

export const listerGestionnaireRéseauQueryHandlerFactory: QueryHandlerFactory<
  {},
  ReadonlyArray<GestionnaireRéseauReadModel>,
  ListerGestionnaireRéseauDependencies
> = ({ listGestionnaireRéseau }) => {
  return async () => listGestionnaireRéseau({ type: 'gestionnaire-réseau' });
};
