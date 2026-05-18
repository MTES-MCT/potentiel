import { Middleware, mediator } from 'mediateur';

import { StatistiquesAdapter } from '@potentiel-infrastructure/domain-adapters';
import { sendEmail } from '@potentiel-infrastructure/email';
import { getLogger } from '@potentiel-libraries/monitoring';

import { setupAppelOffre } from './setupAppelOffre.js';
import { setupDocumentProjet } from './setupDocumentProjet.js';
import { setupNotifications } from './setupNotifications.js';
import { setupProjet } from './setupProjet.js';
import { setupPériode } from './setupPériode.js';
import { setupRéseau } from './setupRéseau.js';
import { setupStatistiqueUtilisation } from './setupStatistiqueUtilisation.js';
import { setupUtilisateur } from './setupUtilisateur.js';

const defaultDependencies = {
  sendEmail,
};
type BootstrapProps = {
  middlewares: Array<Middleware>;
  dependencies?: typeof defaultDependencies;
};
export const bootstrap = async ({
  middlewares,
  dependencies = defaultDependencies,
}: BootstrapProps) => {
  if (mediator.getMessageTypes().length > 0) {
    throw new Error('Application already bootstrapped');
  }

  mediator.use({ middlewares });

  setupStatistiqueUtilisation({
    ajouterStatistiqueUtilisation: StatistiquesAdapter.ajouterStatistique,
  });
  setupNotifications({ sendEmail: dependencies.sendEmail });
  setupUtilisateur();
  setupAppelOffre();
  setupDocumentProjet();
  setupPériode();
  setupProjet();
  setupRéseau();

  getLogger().info('Application bootstrapped');
};
