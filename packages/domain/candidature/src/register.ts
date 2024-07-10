import {
  ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query';
import {
  ListerCandidaturesDependencies,
  registerCandidaturesQuery,
} from './lister/listerCandidatures.query';
import {
  ListerCandidaturesEligiblesPreuveRecanditureDependencies,
  registerCandidaturesEligiblesPreuveRecanditureQuery,
} from './lister/listerCandidaturesEligiblesPreuveRecanditure.query';

type CandidatureQueryDependencies = ConsulterCandidatureDependencies &
  ListerCandidaturesEligiblesPreuveRecanditureDependencies &
  ListerCandidaturesDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterCandidatureQuery(dependencies);
  registerCandidaturesQuery(dependencies);
  registerCandidaturesEligiblesPreuveRecanditureQuery(dependencies);
};
