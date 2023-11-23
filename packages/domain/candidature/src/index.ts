import {
  ConsulterCandidatureQuery,
  RécupérerCandidaturePort,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query';

import {
  ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery,
  RécupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteurPort,
  ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurReadModel,
} from './lister/listerCandidaturesNotifiéesEtNonAbandonnéesParPorteur.query';

// Query
export type CandidatureQuery =
  | ConsulterCandidatureQuery
  | ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery;

export {
  ConsulterCandidatureQuery,
  ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery,
  ConsulterCandidatureReadModel,
  ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurReadModel,
};

// Register
export * from './register';

// Port
export { RécupérerCandidaturePort, RécupérerCandidaturesNotifiéesEtNonAbandonnéesParPorteurPort };

// Projection
export * from './candidature.projection';
