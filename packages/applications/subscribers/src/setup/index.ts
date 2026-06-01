import { ProjetAdapter } from '@potentiel-infrastructure/domain-adapters';
import { récupérerGRDParVille } from '@potentiel-infrastructure/ore-client';

import { mergeSubscriptionSetup } from './createSubscriptionSetup.js';
import { setupHistorique } from './setupHistorique.js';
import { setupProjet } from './setupProjet/index.js';
import { setupPériode } from './setupPériode.js';
import { setupRéseau } from './setupRéseau.js';
import { setupUtilisateur } from './setupUtilisateur.js';

const defaultDependencies = {
  récupérerGRDParVille,
  récupererConstitutionGarantiesFinancières:
    ProjetAdapter.récupererConstitutionGarantiesFinancièresAdapter,
};

export type SetupSubscribersProps = {
  dependencies?: Partial<typeof defaultDependencies>;
};

export const setupSubscribers = ({ dependencies }: SetupSubscribersProps) => {
  const allDependencies = {
    ...defaultDependencies,
    ...dependencies,
  };

  const historique = setupHistorique();
  const projet = setupProjet(allDependencies);
  const utilisateur = setupUtilisateur();
  const période = setupPériode();
  const réseau = setupRéseau();

  return mergeSubscriptionSetup(historique, projet, utilisateur, période, réseau);
};
