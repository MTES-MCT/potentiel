import { registerCandidatureQueries } from '@potentiel-domain/candidature';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';

export const setupDocumentProjet = () => {
  registerCandidatureQueries({
    récupérerCandidature: CandidatureAdapter.récupérerCandidatureAdapter,
  });
};
