import { ProjetSaga } from '@potentiel-domain/projet';

import { SetupProjet } from './setup.js';
import { setupAccès } from './setupAccès.js';
import { setupCandidature } from './setupCandidature.js';
import { setupLauréat } from './setupLauréat/index.js';
import { setupÉliminé } from './setupÉliminé/index.js';

export const setupProjet: SetupProjet = async (dependencies) => {
  ProjetSaga.register();

  const unsetupÉliminé = await setupÉliminé();
  const unsetupLauréat = await setupLauréat(dependencies);
  const unsetupCandidature = await setupCandidature();
  const unsetupAccès = await setupAccès();

  return async () => {
    await unsetupÉliminé();
    await unsetupLauréat();
    await unsetupCandidature();
    await unsetupAccès();
  };
};
