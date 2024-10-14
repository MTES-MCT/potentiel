import { Middleware, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { SendEmail } from '@potentiel-applications/notifications';
import { sendEmail as sendEmailMailjet } from '@potentiel-infrastructure/email';

import { setupLauréat } from './setupLauréat';
import { setupCandidature } from './setupCandidature';
import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffre } from './setupAppelOffre';
import { setupTâche } from './setupTâche';
import { setupUtilisateur } from './setupUtilisateur';
import { setupRéseau } from './setupRéseau';
import { logMiddleware } from './middlewares/log.middleware';
import { setupEliminé } from './setupEliminé';
import { setupTâchePlanifiée } from './setupTâchePlanifiée';
import { setupPériode } from './setupPériode';

let unsubscribe: (() => Promise<void>) | undefined;
let mutex: Promise<void> | undefined;

export const bootstrap = async ({
  middlewares,
  sendEmail,
}: {
  middlewares: Array<Middleware>;
  sendEmail?: SendEmail;
}): Promise<() => Promise<void>> => {
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

    if (!sendEmail) {
      sendEmail = sendEmailMailjet;
    }

    setupUtilisateur();
    await setupAppelOffre();
    const unsetupPériode = await setupPériode({ sendEmail });
    const unsetupCandidature = await setupCandidature({ sendEmail });
    setupDocumentProjet();

    const unsetupTâche = await setupTâche();
    const unsetupTâchePlanifiée = await setupTâchePlanifiée({ sendEmail });

    const unsetupEliminé = await setupEliminé({ sendEmail });
    const unsetupLauréat = await setupLauréat({ sendEmail });
    const unsetupGestionnaireRéseau = await setupRéseau();

    getLogger().info('Application bootstrapped');

    unsubscribe = async () => {
      await unsetupEliminé();
      await unsetupLauréat();
      await unsetupGestionnaireRéseau();
      await unsetupTâche();
      await unsetupTâchePlanifiée();
      await unsetupCandidature();
      await unsetupPériode();
      unsubscribe = undefined;
    };
  }
  if (resolveMutex) {
    resolveMutex();
  }
  mutex = undefined;
  return unsubscribe;
};
