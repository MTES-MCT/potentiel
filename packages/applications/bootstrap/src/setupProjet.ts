import { registerProjetUseCases, registerProjetQueries } from '@potentiel-domain/projet';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import {
  ProjetAdapter,
  DocumentAdapter,
  getScopeProjetUtilisateurAdapter,
} from '@potentiel-infrastructure/domain-adapters';

export const setupProjet = () => {
  registerProjetUseCases({
    getProjetAggregateRoot: ProjetAdapter.getProjetAggregateRootAdapter,
    enregistrerDocumentSubstitut: DocumentAdapter.enregistrerDocumentSubstitutAdapter,
  });

  registerProjetQueries({
    find: findProjection,
    list: listProjection,
    count: countProjection,
    listHistory: listHistoryProjection,
    getScopeProjetUtilisateur: getScopeProjetUtilisateurAdapter,
    récupérerProjetsEligiblesPreuveRecanditure:
      ProjetAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
  });
};
