import { sendEmail } from '@potentiel-infrastructure/email';
import { récupérerGRDParVille } from '@potentiel-infrastructure/ore-client';
import { seedAppelOffre } from '@potentiel-applications/projectors';

import { setupProjet } from './setupProjet';
import { setupHistorique } from './setupHistorique';
import { setupUtilisateur } from './setupUtilisateur';
import { setupPériode } from './setupPériode';
import { setupRéseau } from './setupRéseau';

const defaultDependencies = {
  sendEmail,
  récupérerGRDParVille,
};

export type SetupSubscribersProps = {
  dependencies?: Partial<typeof defaultDependencies>;
};

export const setupSubscribers = async ({ dependencies }: SetupSubscribersProps) => {
  const allDependencies = {
    ...defaultDependencies,
    ...dependencies,
  };

  await seedAppelOffre();

  setupHistorique();
  const unsetupProjet = await setupProjet(allDependencies);
  const unsetupUtilisateur = await setupUtilisateur(allDependencies);
  const unsetupPériode = await setupPériode(allDependencies);
  const unsetupRéseau = await setupRéseau();

  return async () => {
    await unsetupRéseau();
    await unsetupPériode();
    await unsetupUtilisateur();
    await unsetupProjet();
  };
};
