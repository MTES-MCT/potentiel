import { sendEmail } from '@potentiel-infrastructure/email';
import { récupérerGRDParVille } from '@potentiel-infrastructure/ore-client';
import { seedAppelOffre } from '@potentiel-applications/projectors';
import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';

import { setupProjet } from './setupProjet/index.js';
import { setupHistorique } from './setupHistorique.js';
import { setupUtilisateur } from './setupUtilisateur.js';
import { setupPériode } from './setupPériode.js';
import { setupRéseau } from './setupRéseau.js';

const defaultDependencies = {
  sendEmail,
  récupérerGRDParVille,
  récupererConstitutionGarantiesFinancières:
    ProjetAdapter.récupererConstututionGarantiesFinancièresAdapter,
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
