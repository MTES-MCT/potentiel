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
  getProjetAggregateRootAdapter,
} from '@potentiel-infrastructure/domain-adapters';

export const setupProjet = () => {
  registerProjetUseCases({
    getProjetAggregateRoot: getProjetAggregateRootAdapter,
    supprimerDocumentProjetSensible: DocumentAdapter.remplacerDocumentProjetSensible,
    téléchargerGarantiesFinancières: () => ({
      attestation: {
        content: Buffer.from('Fake PDF content'),
        format: 'application/pdf',
      }
    })ProjetAdapter.téléchargerGarantiesFinancièresAdapter,
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
