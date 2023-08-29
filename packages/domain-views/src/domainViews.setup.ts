import { Subscribe, List, Create, Find, Remove, Search, Update } from '@potentiel/core-domain';
import { setupGestionnaireRéseauViews } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { ProjetDependencies, setupProjetViews } from './projet/projet.setup';
import {
  GarantiesFinancièresDependencies,
  setupGarantiesFinancièreViews,
} from './garantiesFinancièresActuelles/garantiesFinancières.setup';
import {
  DépôtGarantiesFinancièresDependencies,
  setupDépôtGarantiesFinancièreViews,
} from './dépôtGarantiesFinancières/dépôtGarantiesFinancières.setup';
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
  dépôtGarantiesFinancières: Omit<DépôtGarantiesFinancièresDependencies, keyof CommonDependencies>;
};

export type UnsetupDomainViews = () => Promise<void>;

export const setupDomainViews = async ({
  common,
  projet,
  raccordement,
  garantiesFinancières,
  dépôtGarantiesFinancières,
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
  const unsubscribeDépôtGarantiesFinancièresViews = await setupDépôtGarantiesFinancièreViews({
    ...common,
    ...dépôtGarantiesFinancières,
  });

  return async () => {
    const unsubscribes = [
      ...unsubscribeGestionnaireRéseauViews,
      ...unsubscribeProjetViews,
      ...unsubscribeRaccordement,
      ...unsubscribeAppelOffreViews,
      ...unsubscribeGarantiesFinancièresViews,
      ...unsubscribeDépôtGarantiesFinancièresViews,
    ];

    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
