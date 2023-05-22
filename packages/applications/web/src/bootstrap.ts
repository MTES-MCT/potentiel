import { setupDomain } from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import {
  téléchargerAccuséRéceptionDemandeComplèteRaccordement,
  téléchargerPropositionTechniqueEtFinancièreSignée,
  téléverserAccuséRéceptionDemandeComplèteRaccordement,
  téléverserPropositionTechniqueEtFinancièreSignée,
  supprimerAccuséRéceptionDemandeComplèteRaccordementAdapter,
} from '@potentiel/infra-adapters/dist/raccordement';
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
    },
    event: {
      create: createProjection,
      remove: removeProjection,
      update: updateProjection,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserAccuséRéceptionDemandeComplèteRaccordement,
      enregistrerFichierPropositionTechniqueEtFinancière:
        téléverserPropositionTechniqueEtFinancièreSignée,
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerAccuséRéceptionDemandeComplèteRaccordement,
      récupérerFichierPropositionTechniqueEtFinancière:
        téléchargerPropositionTechniqueEtFinancièreSignée,
      supprimerAccuséRéceptionDemandeComplèteRaccordement:
        supprimerAccuséRéceptionDemandeComplèteRaccordementAdapter,
    },
    subscribe: await subscribeFactory(),
  });
};
