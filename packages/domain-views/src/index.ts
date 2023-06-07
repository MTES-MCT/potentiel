import { Subscribe } from '@potentiel/core-domain';
import { setupGestionnaireRéseau } from './gestionnaireRéseau';
import { setupProjet } from './projet';
import { Create, Find, List, Remove, Search, Update } from './readModel';

type DomainViewsDependencies = {
  subscribe: Subscribe;
  find: Find;
  list: List;
  search: Search;
  create: Create;
  remove: Remove;
  update: Update;
};

type UnsetupDomainViews = () => Promise<void>;

export const setupDomainViews = (dependencies: DomainViewsDependencies): UnsetupDomainViews => {
  const unsubscribes = [...setupGestionnaireRéseau(dependencies), ...setupProjet(dependencies)];

  return async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};

export {
  ConsulterGestionnaireRéseauQuery,
  GestionnaireRéseauQuery,
  ListerGestionnaireRéseauQuery,
  GestionnaireRéseauReadModel,
} from './gestionnaireRéseau';

export { ConsulterProjetQuery, ProjetQuery, ProjetReadModel } from './projet';

export * from './permissions';
