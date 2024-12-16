import { Middleware, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { SendEmail } from '@potentiel-applications/notifications';
import { sendEmail as sendEmailMailjet } from '@potentiel-infrastructure/email';
import { executeSubscribersRetry } from '@potentiel-infrastructure/pg-event-sourcing';

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
import { setupHistorique } from './setupHistorique';
import { setupStatistiques } from './setupStatistiques';

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

    const unsetupHistorique = await setupHistorique();

    setupStatistiques();
    setupUtilisateur();
    await setupAppelOffre();
    setupDocumentProjet();
    const unsetupCandidature = await setupCandidature({ sendEmail });
    const unsetupPériode = await setupPériode({ sendEmail });

    const unsetupTâche = await setupTâche();
    const unsetupTâchePlanifiée = await setupTâchePlanifiée({ sendEmail });

    const unsetupEliminé = await setupEliminé({ sendEmail });
    const unsetupLauréat = await setupLauréat({ sendEmail });
    const unsetupGestionnaireRéseau = await setupRéseau();

    getLogger().info('Application bootstrapped');

    unsubscribe = async () => {
      await unsetupHistorique();
      await unsetupEliminé();
      await unsetupLauréat();
      await unsetupGestionnaireRéseau();
      await unsetupTâche();
      await unsetupTâchePlanifiée();
      await unsetupCandidature();
      await unsetupPériode();
      unsubscribe = undefined;
    };

    await executeSubscribersRetry();
  }
  if (resolveMutex) {
    resolveMutex();
  }
  mutex = undefined;
  return unsubscribe;
};
