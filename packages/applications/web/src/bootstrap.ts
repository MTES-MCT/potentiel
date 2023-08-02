import { setupDomain } from '@potentiel/domain';
import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  searchProjection,
  updateProjection,
} from '@potentiel/pg-projections';
import {
  consumerSubscribe,
  téléverserFichierDossierRaccordementAdapter,
  téléchargerFichierDossierRaccordementAdapter,
  téléverserFichierAttestationGarantiesFinancièresAdapter,
  téléchargerFichierAttestationGarantiesFinancièresAdapter,
} from '@potentiel/infra-adapters';
import { setupDomainViews, LegacyProjectRepository } from '@potentiel/domain-views';
import { publishToEventBus } from '@potentiel/redis-event-bus-client';
import { consumerPool } from '@potentiel/redis-event-bus-consumer';
import { Message, mediator } from 'mediateur';
import { logMiddleware } from './middlewares/log.middleware';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (legacy: {
  projectRepository: LegacyProjectRepository;
}): Promise<UnsetupApp> => {
  mediator.use<Message>({
    middlewares: [logMiddleware],
  });

  const unsetupDomain = await setupDomain({
    common: {
      loadAggregate,
      publish,
      subscribe: consumerSubscribe,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserFichierDossierRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserFichierDossierRaccordementAdapter,
    },
    projet: { téléverserFichier: téléverserFichierAttestationGarantiesFinancièresAdapter },
  });

  const unsetupDomainViews = await setupDomainViews({
    common: {
      create: createProjection,
      find: findProjection,
      list: listProjection,
      remove: removeProjection,
      search: searchProjection,
      subscribe: consumerSubscribe,
      update: updateProjection,
      legacy,
    },
    raccordement: {
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerFichierDossierRaccordementAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée: téléchargerFichierDossierRaccordementAdapter,
    },
    garantiesFinancières: {
      téléchargerFichier: téléchargerFichierAttestationGarantiesFinancièresAdapter,
    },
  });

  const unsubscribePublishAll = await subscribe('all', async (event) => {
    await publishToEventBus(event.type, event);
  });

  return async () => {
    await unsetupDomain();
    await unsetupDomainViews();
    await unsubscribePublishAll();
    consumerPool.kill();
  };
};
