import { LoadAggregate, Publish, Subscribe } from '@potentiel/core-domain';
import { ProjetDependencies, setupProjet } from './projet/projet.setup';
import { RaccordementDependencies, setupRaccordement } from './raccordement/raccordement.setup';

export type DomainDependencies = {
  common: {
    publish: Publish;
    loadAggregate: LoadAggregate;
    subscribe: Subscribe;
  };
  projet: Omit<ProjetDependencies, keyof DomainDependencies['common']>;
  raccordement: Omit<RaccordementDependencies, keyof DomainDependencies['common']>;
};

export type UnsetupDomain = () => Promise<void>;

export const setupDomain = async ({
  common,
  projet,
  raccordement,
}: DomainDependencies): Promise<UnsetupDomain> => {
  setupRaccordement({
    ...common,
    ...raccordement,
  });

  const unsubscribeProjet = await setupProjet({
    ...common,
    ...projet,
  });

  return async () => {
    const unsubscribes = [...unsubscribeProjet];

    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
