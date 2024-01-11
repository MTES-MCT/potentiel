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
} from '@potentiel-infrastructure/pg-projections';
import {
  téléverserFichierDossierRaccordementAdapter,
  téléchargerFichierDossierRaccordementAdapter,
  récupérerCandidatureAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import { setupDomainViews } from '@potentiel/domain-views';
import { seed } from './seed';

export type UnsetupApp = () => Promise<void>;

/**
 * @deprecated Cette fonction sera bientôt remplacer par celle contenu dans le package @potentiel-application/bootstrap;
 */
export const bootstrap = async (): Promise<UnsetupApp> => {
  await seed();

  const unsetupDomain = await setupDomain({
    common: {
      loadAggregate,
      publish,
      subscribe,
    },
    projet: {},
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
    projet: {
      récupérerCandidature: récupérerCandidatureAdapter,
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
