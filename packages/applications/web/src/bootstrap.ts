import { setupDomain } from '@potentiel/domain';
import { loadAggregate, publish } from '@potentiel/pg-event-sourcing';
import { téléverserFichierDossierRaccordementAdapter } from '@potentiel/infra-adapters';
import { subscribeFactory } from './subscribe.factory';

export const bootstrap = async () => {
  setupDomain({
    common: {
      loadAggregate,
      publish,
      subscribe: await subscribeFactory(),
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserFichierDossierRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserFichierDossierRaccordementAdapter,
    },
  });
};
