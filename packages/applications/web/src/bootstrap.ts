import { setupDomain } from '@potentiel/domain';
import { loadAggregate, publish, subscribe } from '@potentiel/pg-event-sourcing';
import {
  createProjection,
  findProjection,
  listProjection,
  removeProjection,
  searchProjection,
  updateProjection,
  upsertProjection,
} from '@potentiel/pg-projections';
import {
  téléverserFichierDossierRaccordementAdapter,
  téléchargerFichierDossierRaccordementAdapter,
  récupérerCandidatureAdapter,
  téléverserPiéceJustificativeAbandonAdapter,
  téléchargerPiéceJustificativeAbandonProjetAdapter,
} from '@potentiel/infra-adapters';
import { setupDomainViews } from '@potentiel/domain-views';
import { Message, mediator } from 'mediateur';
import { logMiddleware } from './middlewares/log.middleware';
import { seed } from './seed';

export type UnsetupApp = () => Promise<void>;

export const bootstrap = async (): Promise<UnsetupApp> => {
  await seed();

  mediator.use<Message>({
    middlewares: [logMiddleware],
  });

  const unsetupDomain = await setupDomain({
    common: {
      loadAggregate,
      publish,
      subscribe,
    },
    projet: {
      enregistrerPiéceJustificativeAbandon: téléverserPiéceJustificativeAbandonAdapter,
      enregistrerRéponseSignée: async () => {},
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
      upsert: upsertProjection,
    },
    appelOffre: {},
    projet: {
      récupérerCandidature: récupérerCandidatureAdapter,
      récupérerPiéceJustificativeAbandonProjet: téléchargerPiéceJustificativeAbandonProjetAdapter,
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
  };
};
