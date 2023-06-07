import { Subscribe } from '@potentiel/core-domain';
import { setupGestionnaireRéseauViews } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { setupProjetViews } from './projet/projet.setup';
import { List, Create, Find, Remove, Search, Update } from './common.port';

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
    ...setupProjetViews(dependencies),
  ];

  return async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
