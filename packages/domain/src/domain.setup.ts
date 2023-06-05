import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { setupGestionnaireRéseau } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { setupProjet } from './projet/projet.setup';
import { setupRaccordement } from './raccordement/raccordement.setup';
import { RaccordementDependencies } from './raccordement/raccordement.dependencies';

export type UnsetupDomain = () => Promise<void>;

export type DomainDependencies = {
  common: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  raccordement: Omit<RaccordementDependencies, keyof DomainDependencies['common']>;
};

export const setupDomain = ({ common, raccordement }: DomainDependencies): UnsetupDomain => {
  setupGestionnaireRéseau({
    ...common,
  });

  setupProjet({
    ...common,
  });

  const unsubscribes = [
    ...setupRaccordement({
      ...commonDependencies,
      ...raccordement,
    }),
  ];
  return async () => {
    for (const unsubscribe of unsubscribes) {
      await unsubscribe();
    }
  };
};
