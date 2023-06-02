import { setupGestionnaireRéseau } from './gestionnaireRéseau';
import { Create, Find, List, Remove, Search, Update } from './readModel';
import { Subscribe } from './subscribe';

type DomainViewsDependencies = {
  subscribe: Subscribe;
  find: Find;
  list: List;
  search: Search;
  create: Create;
  remove: Remove;
  update: Update;
};

export const setupDomain = (dependencies: DomainViewsDependencies): (() => Promise<void>) => {
  const unsubscribes = [
    ...setupGestionnaireRéseau({
      ...dependencies,
    }),
  ];
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

export * from './permissions';
