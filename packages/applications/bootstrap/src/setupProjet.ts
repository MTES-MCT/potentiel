import { registerProjetUseCases, registerProjetQueries } from '@potentiel-domain/projet';
import {
  DocumentAdapter,
  getProjetUtilisateurScopeAdapter,
  ProjetAdapter,
  DélaiAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import {
  findProjection,
  listProjection,
  countProjection,
  listHistoryProjection,
} from '@potentiel-infrastructure/pg-projection-read';

import { getProjetAggregateRootAdapter } from './adapters/getProjetAggregateRoot.adapter';

export const setupProjet = () => {
  registerProjetUseCases({
    getProjetAggregateRoot: getProjetAggregateRootAdapter,
    supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
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
