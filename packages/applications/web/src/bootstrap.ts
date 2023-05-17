import { setupDomain } from '@potentiel/domain';
import {
  enregistrerAccuséRéceptionDemandeComplèteRaccordement,
  enregistrerFichierPropositionTechniqueEtFinancière,
} from '@potentiel/infra-adapters';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import { subscribeFactory } from './subscribe.factory';

export const bootstrap = async () => {
  setupDomain({
    command: {
      loadAggregate,
      publish,
      enregistrerAccuséRéceptionDemandeComplèteRaccordement,
      enregistrerFichierPropositionTechniqueEtFinancière,
    },
    query: {
      find: findProjection,
      list: listProjection,
    },
    event: {
      create: createProjection,
      find: findProjection,
      remove: removeProjection,
      update: updateProjection,
    },
    subscribe: await subscribeFactory(),
  });
};
