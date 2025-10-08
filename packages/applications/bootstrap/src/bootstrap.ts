import { Middleware, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { sendEmail } from '@potentiel-infrastructure/email';
import { récupérerGRDParVille } from '@potentiel-infrastructure/ore-client';
import { HistoriqueProjector } from '@potentiel-applications/projectors';

import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffre } from './setupAppelOffre';
import { setupUtilisateur } from './setupUtilisateur';
import { setupRéseau } from './setupRéseau';
import { setupProjet } from './setupProjet';
import { setupPériode } from './setupPériode';
import { setupStatistiques } from './setupStatistiques';

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
  if (mediator.getMessageTypes().length > 0) {
    throw new Error('Application already bootstrapped');
  }

  mediator.use({ middlewares });

  const allDependencies = {
    ...defaultDependencies,
    ...dependencies,
  };

  HistoriqueProjector.register();

  setupStatistiques();
  const unsetupUtilisateur = await setupUtilisateur(allDependencies);
  await setupAppelOffre();
  setupDocumentProjet();
  const unsetupPériode = await setupPériode(allDependencies);

  const unsetupProjet = await setupProjet(allDependencies);
  const unsetupGestionnaireRéseau = await setupRéseau();

  getLogger().info('Application bootstrapped');

  return async () => {
    await unsetupProjet();
    await unsetupGestionnaireRéseau();
    await unsetupPériode();
    await unsetupUtilisateur();
  };
};
