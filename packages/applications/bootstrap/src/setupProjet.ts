import { registerProjetQueries, registerProjetUseCases } from '@potentiel-domain/projet';
import {
  DocumentAdapter,
  getScopeProjetUtilisateurAdapter,
  ProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';

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
