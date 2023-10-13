import { setupDomain } from '@potentiel/domain-usecases';
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
  téléverserPièceJustificativeAbandonAdapter,
  téléverserRéponseSignéeAdapter,
  téléchargerPièceJustificativeAbandonProjetAdapter,
  récupérerCandidatureAdapter,
  téléchargerRéponseSignéeAdapter,
  récupérerUtilisateurAdapter,
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
      enregistrerPièceJustificativeAbandon: téléverserPièceJustificativeAbandonAdapter,
      enregistrerRéponseSignée: téléverserRéponseSignéeAdapter,
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
      récupérerPièceJustificativeAbandon: téléchargerPièceJustificativeAbandonProjetAdapter,
      récupérerRéponseSignée: téléchargerRéponseSignéeAdapter,
    },
    raccordement: {
      récupérerAccuséRéceptionDemandeComplèteRaccordement:
        téléchargerFichierDossierRaccordementAdapter,
      récupérerPropositionTechniqueEtFinancièreSignée: téléchargerFichierDossierRaccordementAdapter,
    },
    utilisateur: {
      récupérerUtilisateur: récupérerUtilisateurAdapter,
    },
  });

  return async () => {
    await unsetupDomain();
    await unsetupDomainViews();
  };
};
