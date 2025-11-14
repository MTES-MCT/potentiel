import { registerProjetUseCases, registerProjetQueries } from '@potentiel-domain/projet';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';
import {
  ProjetAdapter,
  DélaiAdapter,
  getProjetUtilisateurScopeAdapter,
  DocumentAdapter,
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
    getScopeProjetUtilisateur: getProjetUtilisateurScopeAdapter,
    récupérerProjetsEligiblesPreuveRecanditure:
      ProjetAdapter.récupérerProjetsEligiblesPreuveRecanditureAdapter,
    consulterABénéficiéDuDélaiCDC2022: DélaiAdapter.consulterABénéficiéDuDélaiCDC2022Adapter,
  });
};
