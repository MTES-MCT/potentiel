import { QueryHandlerFactory, List } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../gestionnaireRéseau.readModel';

type ListerGestionnaireRéseauDependencies = {
  list: List;
};

export const listerGestionnaireRéseauQueryHandlerFactory: QueryHandlerFactory<
  {},
  ReadonlyArray<GestionnaireRéseauReadModel>,
  ListerGestionnaireRéseauDependencies
> = ({ list }) => {
  return async () => list<GestionnaireRéseauReadModel>({ type: 'gestionnaire-réseau' });
};
