import { Subscribe } from '@potentiel/core-domain';
import { List, Create, Find, Remove, Search, Update } from '@potentiel/core-domain-views';
import { setupGestionnaireRéseauViews } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { ProjetDependencies, setupProjetViews } from './projet/projet.setup';
import {
  RaccordementDependencies,
  setupRaccordementViews,
} from './raccordement/raccordement.setup';
import { AppelOffreDependencies, setupAppelOffreViews } from './appelOffre/appelOffre.setup';
import {
  GarantiesFinancièresDependencies,
  setupGarantiesFinancièreViews,
} from './garantiesFinancières/garantiesFinancièresActuelles/garantiesFinancières.setup';
import {
  DépôtGarantiesFinancièresDependencies,
  setupDépôtGarantiesFinancièreViews,
} from './garantiesFinancières/dépôtGarantiesFinancières/dépôtGarantiesFinancières.setup';
import {
  SuiviDépôtsGarantiesFinancièresDependencies,
  setupSuiviDépôtsGarantiesFinancièresViews,
} from './garantiesFinancières/suiviDépôts/suiviDépôts.setup';

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
  suiviDépôtsGarantiesFinancières: Omit<
    SuiviDépôtsGarantiesFinancièresDependencies,
    keyof CommonDependencies
  >;
};

export type UnsetupDomainViews = () => Promise<void>;

export const setupDomainViews = async ({
  common,
  projet,
  raccordement,
  garantiesFinancières,
  dépôtGarantiesFinancières,
  suiviDépôtsGarantiesFinancières,
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
  const unsubscribeSuiviDépôtsGarantiesFinancièresViews =
    await setupSuiviDépôtsGarantiesFinancièresViews({
      ...common,
      ...suiviDépôtsGarantiesFinancières,
    });

  return async () => {
    const unsubscribes = [
      ...unsubscribeGestionnaireRéseauViews,
      ...unsubscribeProjetViews,
      ...unsubscribeRaccordement,
      ...unsubscribeAppelOffreViews,
      ...unsubscribeGarantiesFinancièresViews,
      ...unsubscribeDépôtGarantiesFinancièresViews,
      ...unsubscribeSuiviDépôtsGarantiesFinancièresViews,
    ];

    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
