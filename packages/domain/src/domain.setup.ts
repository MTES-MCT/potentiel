import {
  Create,
  Find,
  List,
  LoadAggregate,
  Publish,
  Remove,
  Subscribe,
  Update,
} from '@potentiel/core-domain';
import { setupGestionnaireRéseau } from './gestionnaireRéseau/gestionnaireRéseau.setup';
import { setupProjet } from './projet/projet.setup';
import { setupRaccordement } from './raccordement/raccordement.setup';
import { RaccordementDependencies } from './raccordement/raccordement.dependencies';

export type UnsetupDomain = () => Promise<void>;

export type DomainDependencies = {
  subscribe: Subscribe;
  command: {
    publish: Publish;
    loadAggregate: LoadAggregate;
  };
  query: {
    find: Find;
    list: List;
  };
  event: {
    create: Create;
    update: Update;
    find: Find;
    remove: Remove;
  };
  raccordement: RaccordementDependencies;
};

export const setupDomain = ({
  command,
  event,
  query,
  subscribe,
  raccordement,
}: DomainDependencies): UnsetupDomain => {
  const commonDependencies = {
    ...command,
    ...event,
    ...query,
    subscribe,
  };

  const unsubscribes = [
    ...setupGestionnaireRéseau({
      commonDependencies,
    }),
    ...setupProjet({}),
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
