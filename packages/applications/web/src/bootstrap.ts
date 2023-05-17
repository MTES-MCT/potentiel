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
    commandPorts: {
      loadAggregate,
      publish,
      enregistrerAccuséRéceptionDemandeComplèteRaccordement,
      enregistrerFichierPropositionTechniqueEtFinancière,
    },
    queryPorts: {
      find: findProjection,
      list: listProjection,
    },
    eventPorts: {
      create: createProjection,
      find: findProjection,
      remove: removeProjection,
      update: updateProjection,
    },
    subscribe: await subscribeFactory(),
  });
};
