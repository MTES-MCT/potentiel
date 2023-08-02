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
import { AppelOffreDependencies, setupAppelOffreViews } from './appelOffre/appelOffre.setup';

type CommonDependencies = {
  subscribe: Subscribe;
  find: Find;
  list: List;
  search: Search;
  create: Create;
  remove: Remove;
  update: Update;
};

type DomainViewsDependencies = {
  common: CommonDependencies;
  appelOffre: Omit<AppelOffreDependencies, keyof CommonDependencies>;
  projet: Omit<ProjetDependencies, keyof CommonDependencies>;
  raccordement: Omit<RaccordementDependencies, keyof CommonDependencies>;
  garantiesFinancières: Omit<GarantiesFinancièresDependencies, keyof CommonDependencies>;
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
  const unsubscribeAppelOffreViews = await setupAppelOffreViews(common);

  return async () => {
    const unsubscribes = [
      ...unsubscribeGestionnaireRéseauViews,
      ...unsubscribeProjetViews,
      ...unsubscribeRaccordement,
      ...unsubscribeAppelOffreViews,
      ...unsubscribeGarantiesFinancièresViews,
    ];

    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
