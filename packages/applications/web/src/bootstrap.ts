import { setupDomain } from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  searchProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import {
  téléverserAccuséRéceptionDemandeComplèteRaccordementAdapter,
  téléverserPropositionTechniqueEtFinancièreSignéeAdapter,
  supprimerAccuséRéceptionDemandeComplèteRaccordementAdapter,
  supprimerPropositionTechniqueEtFinancièreSignéeAdapter,
  téléchargerPropositionTechniqueEtFinancièreSignéeAdapter,
  téléchargerAccuséRéceptionDemandeComplèteRaccordementAdapter,
} from '@potentiel/infra-adapters';
import { subscribeFactory } from './subscribe.factory';

export const bootstrap = async () => {
  setupDomain({
    command: {
      loadAggregate,
      publish,
    },
    query: {
      find: findProjection,
      list: listProjection,
      search: searchProjection,
    },
    event: {
      create: createProjection,
      remove: removeProjection,
      update: updateProjection,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserAccuséRéceptionDemandeComplèteRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserPropositionTechniqueEtFinancièreSignéeAdapter,
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerAccuséRéceptionDemandeComplèteRaccordementAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée:
        téléchargerPropositionTechniqueEtFinancièreSignéeAdapter,
      supprimerAccuséRéceptionDemandeComplèteRaccordement:
        supprimerAccuséRéceptionDemandeComplèteRaccordementAdapter,
      supprimerPropositionTechniqueEtFinancièreSignée:
        supprimerPropositionTechniqueEtFinancièreSignéeAdapter,
    },
    subscribe: await subscribeFactory(),
  });
};
