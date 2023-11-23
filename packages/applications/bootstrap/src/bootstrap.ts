import { mediator } from 'mediateur';
import { logMiddleware } from '@potentiel-libraries/mediateur-middlewares';
import { setupLauréat } from './setupLauréat';
import { getLogger } from '@potentiel/monitoring';
import { setupCandidature } from './setupCandidature';
import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffre } from './setupAppelOffre';
import { setupTâche } from './setupTâche';

export const bootstrap = async (): Promise<() => Promise<void>> => {
  mediator.use({
    middlewares: [logMiddleware],
  });

  setupAppelOffre();
  setupCandidature();
  setupDocumentProjet();
  setupTâche();

  const unsetupLauréat = await setupLauréat();

  getLogger().info('Application bootstrapped');

  return async () => {
    await unsetupLauréat();
  };
};
