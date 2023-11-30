import { mediator } from 'mediateur';
import { logMiddleware } from '@potentiel-libraries/mediateur-middlewares';
import { setupLauréat } from './setupLauréat';
import { getLogger } from '@potentiel/monitoring';
import { setupCandidature } from './setupCandidature';
import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffre } from './setupAppelOffre';
import { setupTâche } from './setupTâche';
import { setupUtilisateur } from './setupUtilisateur';
import { permissionMiddleware } from '@potentiel-domain/utilisateur';

export const bootstrap = async (): Promise<() => Promise<void>> => {
  mediator.use({
    middlewares: [logMiddleware],
  });

  mediator.use({
    messageType: 'LISTER_ABANDONS_QUERY',
    middlewares: [permissionMiddleware],
  });

  setupAppelOffre();
  setupCandidature();
  setupDocumentProjet();
  const unsetupTâche = await setupTâche();
  setupUtilisateur();

  const unsetupLauréat = await setupLauréat();

  getLogger().info('Application bootstrapped');

  return async () => {
    await unsetupLauréat();
    await unsetupTâche();
  };
};
