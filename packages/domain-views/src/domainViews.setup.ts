import { Subscribe } from '@potentiel/core-domain';
import { setupGestionnaireRéseauViews } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { setupProjetViews } from './projet/projet.setup';
import { setupGarantiesFinancièreViews } from './garantiesFinancières/garantiesFinancières.setup';
import {
  RaccordementDependencies,
  setupRaccordementViews,
} from './raccordement/raccordement.setup';
import { List, Create, Find, Remove, Search, Update } from './common.port';
import { LegacyProjectRepository } from './legacy.dependencies';

type DomainViewsDependencies = {
  common: {
    subscribe: Subscribe;
    find: Find;
    list: List;
    search: Search;
    create: Create;
    remove: Remove;
    update: Update;
    legacy: {
      projectRepository: LegacyProjectRepository;
    };
  };
  raccordement: Omit<RaccordementDependencies, keyof DomainViewsDependencies['common']>;
};

export type UnsetupDomainViews = () => Promise<void>;

export const setupDomainViews = async ({
  common,
  raccordement,
}: DomainViewsDependencies): Promise<UnsetupDomainViews> => {
  const unsubscribeGestionnaireRéseauViews = await setupGestionnaireRéseauViews(common);
  const unsubscribeProjetViews = await setupProjetViews(common);
  const unsubscribeGarantiesFinancièresViews = await setupGarantiesFinancièreViews(common);
  const unsubscribeRaccordement = await setupRaccordementViews({
    ...common,
    ...raccordement,
  });

  return async () => {
    const unsubscribes = [
      ...unsubscribeGestionnaireRéseauViews,
      ...unsubscribeProjetViews,
      ...unsubscribeRaccordement,
      ...unsubscribeGarantiesFinancièresViews,
    ];

    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
