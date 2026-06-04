import type { Lauréat, RécupererGRDParVillePort } from '@potentiel-domain/projet';

import type { SubscriberSetup } from '../createSubscriptionSetup.js';

export type SetupProjetDependencies = {
  récupérerGRDParVille: RécupererGRDParVillePort;
  récupererConstitutionGarantiesFinancières: Lauréat.GarantiesFinancières.RécupererConstitutionGarantiesFinancièresPort;
};

export type SetupProjet = (dependencies: SetupProjetDependencies) => SubscriberSetup;
