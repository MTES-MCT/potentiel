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
  consumerSubscribe,
  téléchargerFichierAdapter,
  téléverserFichierAdapter,
} from '@potentiel/infra-adapters';
import { setupDomainViews, LegacyProjectRepository } from '@potentiel/domain-views';
import { Message, mediator } from 'mediateur';
import { logMiddleware } from './middlewares/log.middleware';
import { publishToEventBus } from '@potentiel/redis-event-bus-client';
import { consumerPool } from '@potentiel/redis-event-bus-consumer';

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
      subscribe: consumerSubscribe,
    },
    raccordement: {
      enregistrerAccuséRéceptionDemandeComplèteRaccordement:
        téléverserFichierDossierRaccordementAdapter,
      enregistrerPropositionTechniqueEtFinancièreSignée:
        téléverserFichierDossierRaccordementAdapter,
    },
    projet: { téléverserFichier: téléverserFichierAdapter },
    dépôtGarantiesFinancières: { téléverserFichier: téléverserFichierAdapter },
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
      téléchargerFichier: téléchargerFichierAdapter,
    },
    dépôtGarantiesFinancières: {
      téléchargerFichier: téléchargerFichierAdapter,
    },
  });

  const unsubscribePublishAll = await subscribe({
    name: 'new_event',
    eventType: 'all',
    eventHandler: async (event) => {
      await publishToEventBus(event.type, event);
    },
  });

  return async () => {
    await unsetupDomain();
    await unsetupDomainViews();
    await unsubscribePublishAll();
    consumerPool.kill();
  };
};
