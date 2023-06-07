import { Subscribe } from '@potentiel/core-domain';
import { setupGestionnaireRéseauViews } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { setupProjetViews } from './projet/projet.setup';
import { List, Create, Find, Remove, Search, Update } from './common.port';
import {
  RaccordementDependencies,
  setupRaccordementViews,
} from './raccordement/raccordement.setup';

type DomainViewsDependencies = {
  common: {
    subscribe: Subscribe;
    find: Find;
    list: List;
    search: Search;
    create: Create;
    remove: Remove;
    update: Update;
  };
  raccordement: Omit<RaccordementDependencies, keyof DomainViewsDependencies['common']>;
};

type UnsetupDomainViews = () => Promise<void>;

export const setupDomainViews = ({
  common,
  raccordement,
}: DomainViewsDependencies): UnsetupDomainViews => {
  const unsubscribes = [
    ...setupGestionnaireRéseauViews({
      ...common,
    }),
    ...setupProjetViews({
      ...common,
    }),
    ...setupRaccordementViews({
      ...common,
      ...raccordement,
    }),
  ];

  return async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
