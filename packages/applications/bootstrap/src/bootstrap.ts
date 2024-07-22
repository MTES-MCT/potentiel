import { Middleware, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Notification } from '@potentiel-applications/notifications';

import { setupLauréat } from './setupLauréat';
import { setupCandidature } from './setupCandidature';
import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffre } from './setupAppelOffre';
import { setupTâche } from './setupTâche';
import { setupUtilisateur } from './setupUtilisateur';
import { setupRéseau } from './setupRéseau';
import { logMiddleware } from './middlewares/log.middleware';
import { delayMiddleware } from './middlewares/delay.middleware';
import { setupEliminé } from './setupEliminé';
import { setupTâchePlanifiée } from './setupTâchePlanifiée';

let unsubscribe: (() => Promise<void>) | undefined;
let mutex: Promise<void> | undefined;

export const bootstrap = async ({
  middlewares,
}: {
  middlewares: Array<Middleware>;
}): Promise<() => Promise<void>> => {
  // if there's already a bootstrap operation in progress, wait for it to finish
  if (mutex) {
    await mutex;
  }
  let resolveMutex: (() => void) | undefined;
  mutex = new Promise((r) => (resolveMutex = r));

  if (!unsubscribe) {
    mediator.use({
      middlewares: [logMiddleware, delayMiddleware, ...middlewares],
    });

    Notification.register();

    setupAppelOffre();
    setupCandidature();
    setupDocumentProjet();
    const unsetupTâche = await setupTâche();
    const unsetupTâchePlanifiée = await setupTâchePlanifiée();
    setupUtilisateur();

    const unsetupEliminé = await setupEliminé();
    const unsetupLauréat = await setupLauréat();
    const unsetupGestionnaireRéseau = await setupRéseau();

    getLogger().info('Application bootstrapped');

    unsubscribe = async () => {
      await unsetupEliminé();
      await unsetupLauréat();
      await unsetupGestionnaireRéseau();
      await unsetupTâche();
      await unsetupTâchePlanifiée();
      unsubscribe = undefined;
    };
  }
  if (resolveMutex) {
    resolveMutex();
  }
  mutex = undefined;
  return unsubscribe;
};
