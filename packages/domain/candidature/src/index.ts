import {
  ConsulterCandidatureQuery,
  RécupérerCandidaturePort,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query';

import {
  ListerCandidaturesEligiblesPreuveRecanditureQuery,
  RécupérerCandidaturesEligiblesPreuveRecanditurePort,
  ListerCandidaturesEligiblesPreuveRecanditureReadModel,
} from './lister/listerCandidaturesNotifiéesEtNonAbandonnéesParPorteur.query';

// Query
export type CandidatureQuery =
  | ConsulterCandidatureQuery
  | ListerCandidaturesEligiblesPreuveRecanditureQuery;

export {
  ConsulterCandidatureQuery,
  ListerCandidaturesEligiblesPreuveRecanditureQuery as ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery,
  ConsulterCandidatureReadModel,
  ListerCandidaturesEligiblesPreuveRecanditureReadModel as ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurReadModel,
};

// Register
export * from './register';

// Port
export {
  RécupérerCandidaturePort,
  RécupérerCandidaturesEligiblesPreuveRecanditurePort as RécupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteurPort,
};

// Projection
export * from './candidature.projection';
