import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import {
  ListerCandidaturesDependencies,
  registerCandidaturesQuery,
} from './lister/listerCandidatures.query';
import {
  ListerCandidaturesEligiblesPreuveRecanditureDependencies,
  registerCandidaturesEligiblesPreuveRecanditureQuery,
} from './lister/listerCandidaturesEligiblesPreuveRecanditure.query';

type CandidatureQueryDependencies = ConsulterProjetDependencies &
  ListerCandidaturesEligiblesPreuveRecanditureDependencies &
  ListerCandidaturesDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterProjetQuery(dependencies);
  registerCandidaturesQuery(dependencies);
  registerCandidaturesEligiblesPreuveRecanditureQuery(dependencies);
};
