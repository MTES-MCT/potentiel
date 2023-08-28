import { setupDomain } from '@potentiel/domain';
import {
  loadAggregate,
  publish,
  subscribe,
  deleteAllSubscribers,
} from '@potentiel/pg-event-sourcing';
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
  récupérerDétailProjetAdapter,
  consumerSubscribe,
  téléchargerFichierAdapter,
  téléverserFichierAdapter,
  déplacerFichierAdapter,
  supprimerFichierAdapter,
} from '@potentiel/infra-adapters';
import { setupDomainViews } from '@potentiel/domain-views';
import { Message, mediator } from 'mediateur';
import { logMiddleware } from './middlewares/log.middleware';
import { publishToEventBus } from '@potentiel/redis-event-bus-client';
import { consumerPool } from '@potentiel/redis-event-bus-consumer';
import { seed } from './seed';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (): Promise<UnsetupApp> => {
  await seed();

  await deleteAllSubscribers();
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
    garantiesFinancières: {
      téléverserFichier: téléverserFichierAdapter,
      déplacerFichier: déplacerFichierAdapter,
      supprimerFichier: supprimerFichierAdapter,
    },
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
    },
    appelOffre: {},
    projet: {
      récupérerDétailProjet: récupérerDétailProjetAdapter,
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
      récupérerDétailProjet: récupérerDétailProjetAdapter,
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
