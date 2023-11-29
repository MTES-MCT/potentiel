import {
  ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query';
import {
  ListerCandidaturesEligiblesPreuveRecanditureDependencies,
  registerCandidaturesEligiblesPreuveRecanditureQuery,
} from './lister/listerCandidaturesEligiblesPreuveRecanditure.query';

type CandidatureQueryDependencies = ConsulterCandidatureDependencies &
  ListerCandidaturesEligiblesPreuveRecanditureDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterCandidatureQuery(dependencies);
  registerCandidaturesEligiblesPreuveRecanditureQuery(dependencies);
};
