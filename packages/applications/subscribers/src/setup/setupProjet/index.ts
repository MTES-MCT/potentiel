import { ProjetSaga } from '@potentiel-domain/projet';

import { SetupProjet } from './setup.js';
import { setupÉliminé } from './setupÉliminé/index.js';
import { setupLauréat } from './setupLauréat/index.js';
import { setupCandidature } from './setupCandidature.js';
import { setupAccès } from './setupAccès.js';

export const setupProjet: SetupProjet = async (dependencies) => {
  ProjetSaga.register();

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
