import { Subscribe } from '@potentiel/core-domain';
import { setupGestionnaireRéseauViews } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { ProjetDependencies, setupProjetViews } from './projet/projet.setup';
import { List, Create, Find, Remove, Search, Update } from './common.port';
import {
  GarantiesFinancièresDependencies,
  setupGarantiesFinancièreViews,
} from './garantiesFinancières/garantiesFinancières.setup';
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
  projet: Omit<ProjetDependencies, keyof DomainViewsDependencies['common']>;
  raccordement: Omit<RaccordementDependencies, keyof DomainViewsDependencies['common']>;
  garantiesFinancières: Omit<
    GarantiesFinancièresDependencies,
    keyof DomainViewsDependencies['common']
  >;
};

export type UnsetupDomainViews = () => Promise<void>;

export const setupDomainViews = async ({
  common,
  projet,
  raccordement,
  garantiesFinancières,
}: DomainViewsDependencies): Promise<UnsetupDomainViews> => {
  const unsubscribeGestionnaireRéseauViews = await setupGestionnaireRéseauViews(common);
  const unsubscribeProjetViews = await setupProjetViews({
    ...common,
    ...projet,
  });
  const unsubscribeGarantiesFinancièresViews = await setupGarantiesFinancièreViews({
    ...common,
    ...garantiesFinancières,
  });
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
