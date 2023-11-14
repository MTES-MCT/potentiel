import { mediator } from 'mediateur';
import { logMiddleware } from '@potentiel-libraries/mediateur-middlewares';
import { setupLauréat } from './setupLauréat';
import { getLogger } from '@potentiel/monitoring';
import { setupCandidature } from './setupCandidature';
import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffres } from './setupAppelOffres';

export const bootstrap = async (): Promise<() => Promise<void>> => {
  mediator.use({
    middlewares: [logMiddleware],
  });

  setupAppelOffres();
  setupCandidature();
  setupDocumentProjet();

  const unsetupLauréat = await setupLauréat();

  getLogger().info('Application bootstrapped');

  return async () => {
    await unsetupLauréat();
  };
};
