import {
  ConsulterProjetQuery,
  RécupérerCandidaturePort,
  ConsulterProjetReadModel,
} from './consulter/consulterProjet.query';
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
  | ConsulterProjetQuery
  | ListerCandidaturesEligiblesPreuveRecanditureQuery
  | ListerCandidaturesQuery;

export {
  ConsulterProjetQuery,
  ListerCandidaturesEligiblesPreuveRecanditureQuery,
  ConsulterProjetReadModel,
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
