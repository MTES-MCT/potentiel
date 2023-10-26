import { mediator } from 'mediateur';
import { logMiddleware } from '@potentiel-libraries/mediateur-middlewares';
import { setupLauréat } from './setupLauréat';
import { getLogger } from '@potentiel/monitoring';
import { setupCandidature } from './setupCandidature';
import { setupDocumentProjet } from './setupDocumentProjet';
let unsetup: () => Promise<void>;

export const bootstrap = async (): Promise<() => Promise<void>> => {
  if (!unsetup) {
    mediator.use({
      middlewares: [logMiddleware],
    });

    setupCandidature();
    setupDocumentProjet();

    const unsetupLauréat = await setupLauréat();

    unsetup = async () => {
      await unsetupLauréat();
    };

    getLogger().info('Application bootstrapped');
  }

  return unsetup;
};
