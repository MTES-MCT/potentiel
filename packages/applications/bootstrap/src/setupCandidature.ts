import { registerCandidatureQueries } from '@potentiel-domain/candidature';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

export const setupCandidature = () => {
  registerCandidatureQueries({
    récupérerCandidature: CandidatureAdapter.récupérerCandidatureAdapter,
    récupérerCandidaturesEligiblesPreuveRecanditure:
      CandidatureAdapter.récupérerCandidaturesEligiblesPreuveRecanditureAdapter,
    récupérerCandidatures: CandidatureAdapter.récupérerCandidaturesAdapter,
  });
};
