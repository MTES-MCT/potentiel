import { SetupProjet } from './setup';
import { setupÉliminé } from './setupÉliminé';
import { setupLauréat } from './setupLauréat';
import { setupCandidature } from './setupCandidature';
import { setupAccès } from './setupAccès';

export const setupProjet: SetupProjet = async (dependencies) => {
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
