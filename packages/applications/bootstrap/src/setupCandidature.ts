import {
  registerCandidatureQueries,
  registerCandidaturesUseCases,
} from '@potentiel-domain/candidature';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

export const setupCandidature = () => {
  registerCandidatureQueries({
    récupérerProjet: CandidatureAdapter.récupérerProjetAdapter,
    récupérerProjetsEligiblesPreuveRecanditure:
      CandidatureAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
    récupérerProjets: CandidatureAdapter.récupérerProjetsAdapter,
  });

  registerCandidaturesUseCases({ loadAggregate });
};
