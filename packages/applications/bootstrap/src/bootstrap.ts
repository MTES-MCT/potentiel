import { Middleware, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';

import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffre } from './setupAppelOffre';
import { setupUtilisateur } from './setupUtilisateur';
import { setupRéseau } from './setupRéseau';
import { setupProjet } from './setupProjet';
import { setupPériode } from './setupPériode';
import { setupStatistiques } from './setupStatistiques';

type BootstrapProps = {
  middlewares: Array<Middleware>;
};
export const bootstrap = async ({ middlewares }: BootstrapProps) => {
  if (mediator.getMessageTypes().length > 0) {
    throw new Error('Application already bootstrapped');
  }

  mediator.use({ middlewares });

  setupStatistiques();
  setupUtilisateur();
  setupAppelOffre();
  setupDocumentProjet();
  setupPériode();
  setupProjet();
  setupRéseau();

  getLogger().info('Application bootstrapped');
};
