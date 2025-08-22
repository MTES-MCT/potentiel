import { type Middleware, mediator } from 'mediateur';

import { sendEmail } from '@potentiel-infrastructure/email';
import { récupérerGRDParVille } from '@potentiel-infrastructure/ore-client';
import { getLogger } from '@potentiel-libraries/monitoring';

import { logMiddleware } from './middlewares/log.middleware';
import { setupAppelOffre } from './setupAppelOffre';
import { setupDocumentProjet } from './setupDocumentProjet';
import { setupHistorique } from './setupHistorique';
import { setupLauréat } from './setupLauréat';
import { setupProjet } from './setupProjet';
import { setupPériode } from './setupPériode';
import { setupRéseau } from './setupRéseau';
import { setupStatistiques } from './setupStatistiques';
import { setupTâche } from './setupTâche';
import { setupUtilisateur } from './setupUtilisateur';

let unsubscribe: (() => Promise<void>) | undefined;

const defaultDependencies = {
  sendEmail,
  récupérerGRDParVille,
};

type BootstrapProps = {
  middlewares: Array<Middleware>;
  dependencies?: Partial<typeof defaultDependencies>;
};
export const bootstrap = async ({
  middlewares,
  dependencies,
}: BootstrapProps): Promise<() => Promise<void>> => {
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

    const unsetupTâche = await setupTâche();

    const unsetupProjet = await setupProjet(allDependencies);
    const unsetupLauréat = await setupLauréat(allDependencies);
    const unsetupGestionnaireRéseau = await setupRéseau();

    getLogger().info('Application bootstrapped');

    unsubscribe = async () => {
      await unsetupHistorique();
      await unsetupProjet();
      await unsetupLauréat();
      await unsetupGestionnaireRéseau();
      await unsetupTâche();
      await unsetupPériode();
      await unsetupUtilisateur();
      unsubscribe = undefined;
    };
  }
  return unsubscribe;
};
