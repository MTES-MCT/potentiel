import { registerProjetQueries, registerProjetUseCases } from '@potentiel-domain/projet';
import {
  DocumentAdapter,
  DélaiAdapter,
  getProjetUtilisateurScopeAdapter,
  ProjetAdapter,
} from '@potentiel-infrastructure/domain-adapters';
import {
  countProjection,
  findProjection,
  listHistoryProjection,
  listProjection,
} from '@potentiel-infrastructure/pg-projection-read';

import { getProjetAggregateRootAdapter } from '../adapters/getProjetAggregateRoot.adapter';
import type { SetupProjet } from './setup';
import { setupAccès } from './setupAccès';
import { setupCandidature } from './setupCandidature';
import { setupLauréat } from './setupLauréat';
import { setupÉliminé } from './setupÉliminé';

export const setupProjet: SetupProjet = async (dependencies) => {
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

  const unsetupÉliminé = await setupÉliminé(dependencies);
  const unsetupLauréat = await setupLauréat(dependencies);
  const unsetupCandidature = await setupCandidature(dependencies);
  const unsetupAccès = await setupAccès(dependencies);

  return async () => {
    await unsetupÉliminé();
    await unsetupLauréat();
    await unsetupCandidature();
    await unsetupAccès();
  };
};
