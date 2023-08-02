import { setupDomain } from '@potentiel/domain';
import { cleanSubscribers, loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  searchProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import {
  téléverserFichierDossierRaccordementAdapter,
  téléchargerFichierDossierRaccordementAdapter,
} from '@potentiel/infra-adapters';
import { setupDomainViews, LegacyProjectRepository } from '@potentiel/domain-views';
import { consumerPool } from '@potentiel/redis-event-bus-consumer';
import { Message, mediator } from 'mediateur';
import { logMiddleware } from './middlewares/log.middleware';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (legacy: {
  projectRepository: LegacyProjectRepository;
}): Promise<UnsetupApp> => {
  await cleanSubscribers();
  mediator.use<Message>({
    middlewares: [logMiddleware],
  });

  const unsetupDomain = await setupDomain({
    common: {
      loadAggregate,
      publish,
      subscribe,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserFichierDossierRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserFichierDossierRaccordementAdapter,
    },
  });

  const unsetupDomainViews = await setupDomainViews({
    common: {
      create: createProjection,
      find: findProjection,
      list: listProjection,
      remove: removeProjection,
      search: searchProjection,
      subscribe,
      update: updateProjection,
      legacy,
    },
    raccordement: {
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerFichierDossierRaccordementAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée: téléchargerFichierDossierRaccordementAdapter,
    },
  });

  return async () => {
    await unsetupDomain();
    await unsetupDomainViews();
    consumerPool.kill();
  };
};
