import {
  ConsulterCandidatureQuery,
  RécupérerCandidaturePort,
  ConsulterCandidatureReadModel,
} from './consulter/consulterCandidature.query';
import {
  ListerCandidaturesEligiblesPreuveRecanditureQuery,
  RécupérerCandidaturesEligiblesPreuveRecanditurePort,
  ListerCandidaturesEligiblesPreuveRecanditureReadModel,
} from './lister/listerCandidaturesEligiblesPreuveRecanditure.query';

// Query
export type CandidatureQuery =
  | ConsulterCandidatureQuery
  | ListerCandidaturesEligiblesPreuveRecanditureQuery;

export {
  ConsulterCandidatureQuery,
  ListerCandidaturesEligiblesPreuveRecanditureQuery,
  ConsulterCandidatureReadModel,
  ListerCandidaturesEligiblesPreuveRecanditureReadModel,
};

// Register
export * from './register';

// Port
export { RécupérerCandidaturePort, RécupérerCandidaturesEligiblesPreuveRecanditurePort };

// Entity
export * from './candidature.entity';
