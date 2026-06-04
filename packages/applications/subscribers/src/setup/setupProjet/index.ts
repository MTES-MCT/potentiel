import { ProjetSaga } from '@potentiel-domain/projet';

import { mergeSubscriptionSetup } from '../createSubscriptionSetup.js';
import type { SetupProjet } from './setup.js';
import { setupAccès } from './setupAccès.js';
import { setupCandidature } from './setupCandidature.js';
import { setupLauréat } from './setupLauréat/index.js';
import { setupÉliminé } from './setupÉliminé/index.js';

export const setupProjet: SetupProjet = (dependencies) => {
  ProjetSaga.register();

  const éliminé = setupÉliminé();
  const lauréat = setupLauréat(dependencies);
  const candidature = setupCandidature();
  const accès = setupAccès();

  return mergeSubscriptionSetup(éliminé, lauréat, candidature, accès);
};
