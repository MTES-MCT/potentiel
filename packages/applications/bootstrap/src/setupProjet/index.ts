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
  récupérerIdentifiantsProjetParEmailPorteurAdapter,
} from '@potentiel-infrastructure/domain-adapters';

import { getProjetAggregateRootAdapter } from '../adapters/getProjetAggregateRoot.adapter';

import { SetupProjet } from './setup';
import { setupÉliminé } from './setupÉliminé';
import { setupLauréat } from './setupLauréat';
import { setupCandidature } from './setupCandidature';
import { setupAccès } from './setupAccès';

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
    récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
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
