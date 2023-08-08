import { LoadAggregate, Publish, Subscribe } from '@potentiel/core-domain';
import { setupGestionnaireRéseau } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { ProjetDependencies, setupProjet } from './projet/projet.setup';
import { RaccordementDependencies, setupRaccordement } from './raccordement/raccordement.setup';
import {
  DépôtGarantiesFinancièresDependencies,
  setupDépôtGarantiesFinancières,
} from './dépôtGarantiesFinancières/dépôtGarantiesFinancières.setup';

export type DomainDependencies = {
  common: {
    publish: Publish;
    loadAggregate: LoadAggregate;
    subscribe: Subscribe;
  };
  raccordement: Omit<RaccordementDependencies, keyof DomainDependencies['common']>;
  projet: Omit<ProjetDependencies, keyof DomainDependencies['common']>;
  dépôtGarantiesFinancières: Omit<
    DépôtGarantiesFinancièresDependencies,
    keyof DomainDependencies['common']
  >;
};

export type UnsetupDomain = () => Promise<void>;

export const setupDomain = async ({
  common,
  raccordement,
  projet,
  dépôtGarantiesFinancières,
}: DomainDependencies): Promise<UnsetupDomain> => {
  setupRaccordement({
    ...common,
    ...raccordement,
  });

  setupGestionnaireRéseau(common);

  setupDépôtGarantiesFinancières({ ...common, ...dépôtGarantiesFinancières });

  const unsubscribeProjet = await setupProjet({ ...common, ...projet });

  return async () => {
    const unsubscribes = [...unsubscribeProjet];

    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
