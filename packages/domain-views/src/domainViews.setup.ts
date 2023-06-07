import { Subscribe } from '@potentiel/core-domain';
import { setupGestionnaireRéseauViews } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { List, Create, Find, Remove, Search, Update } from './domainViews.port';
import { setupProjet } from './projet';

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
  const unsubscribes = [
    ...setupGestionnaireRéseauViews(dependencies),
    ...setupProjet(dependencies),
  ];

  return async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
