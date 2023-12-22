import { mediator } from 'mediateur';
import { Permission } from '@potentiel-libraries/mediateur-middlewares';
import { setupLauréat } from './setupLauréat';
import { getLogger } from '@potentiel/monitoring';
import { setupCandidature } from './setupCandidature';
import { setupDocumentProjet } from './setupDocumentProjet';
import { setupAppelOffre } from './setupAppelOffre';
import { setupTâche } from './setupTâche';
import { setupUtilisateur } from './setupUtilisateur';

export const bootstrap = async (): Promise<() => Promise<void>> => {
  // mediator.use({
  //   middlewares: [Log.middleware],
  // });

  mediator.use({
    messageType: 'DEMANDER_ABANDON_USECASE',
    middlewares: [Permission.middleware],
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
