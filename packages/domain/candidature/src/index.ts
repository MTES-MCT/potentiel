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
import {
  RécupérerCandidaturesPort,
  ListerCandidaturesQuery,
  ListerCandidaturesReadModel,
  ListerCandidaturesListItemReadModel,
} from './lister/listerCandidatures.query';

// Query
export type CandidatureQuery =
  | ConsulterCandidatureQuery
  | ListerCandidaturesEligiblesPreuveRecanditureQuery
  | ListerCandidaturesQuery;

export {
  ConsulterCandidatureQuery,
  ListerCandidaturesEligiblesPreuveRecanditureQuery,
  ConsulterCandidatureReadModel,
  ListerCandidaturesEligiblesPreuveRecanditureReadModel,
  ListerCandidaturesQuery,
  ListerCandidaturesListItemReadModel,
  ListerCandidaturesReadModel,
};

// Register
export * from './register';

// Port
export {
  RécupérerCandidaturePort,
  RécupérerCandidaturesEligiblesPreuveRecanditurePort,
  RécupérerCandidaturesPort,
};

// Entity
export * from './candidature.entity';
