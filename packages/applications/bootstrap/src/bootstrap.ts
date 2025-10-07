import { Middleware, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { sendEmail } from '@potentiel-infrastructure/email';

import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffre } from './setupAppelOffre';
import { setupUtilisateur } from './setupUtilisateur';
import { setupRéseau } from './setupRéseau';
import { logMiddleware } from './middlewares/log.middleware';
import { setupProjet } from './setupProjet';
import { setupPériode } from './setupPériode';
import { setupHistorique } from './setupHistorique';
import { setupStatistiques } from './setupStatistiques';

let unsubscribe: (() => Promise<void>) | undefined;
let mutex: Promise<void> | undefined;

const defaultDependencies = {
  sendEmail,
};

type BootstrapProps = {
  middlewares: Array<Middleware>;
  dependencies?: Partial<typeof defaultDependencies>;
};
export const bootstrap = async ({
  middlewares,
  dependencies,
}: BootstrapProps): Promise<() => Promise<void>> => {
  // if there's already a bootstrap operation in progress, wait for it to finish
  if (mutex) {
    await mutex;
  }
  let resolveMutex: (() => void) | undefined;
  mutex = new Promise((r) => (resolveMutex = r));

  if (!unsubscribe) {
    mediator.use({
      middlewares: [logMiddleware, ...middlewares],
    });
    const allDependencies = {
      ...defaultDependencies,
      ...dependencies,
    };

    const unsetupHistorique = await setupHistorique();

    setupStatistiques();
    const unsetupUtilisateur = await setupUtilisateur(allDependencies);
    await setupAppelOffre();
    setupDocumentProjet();
    const unsetupPériode = await setupPériode(allDependencies);

    setupProjet();
    const unsetupGestionnaireRéseau = await setupRéseau();

    getLogger().info('Application bootstrapped');

    unsubscribe = async () => {
      await unsetupHistorique();
      await unsetupGestionnaireRéseau();
      await unsetupPériode();
      await unsetupUtilisateur();
      unsubscribe = undefined;
    };
  }
  if (resolveMutex) {
    resolveMutex();
  }
  mutex = undefined;
  return unsubscribe;
};
