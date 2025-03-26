import {
  ConsulterProjetDependencies,
  registerConsulterProjetQuery,
} from './consulter/consulterProjet.query';
import {
  ListerProjetsEligiblesPreuveRecanditureDependencies,
  registerProjetsEligiblesPreuveRecanditureQuery,
} from './lister/listerProjetsEligiblesPreuveRecanditure.query';
import {
  ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query';
import {
  ListerCandidaturesQueryDependencies,
  registerListerCandidaturesQuery,
} from './lister/listerCandidatures.query';

type CandidatureQueryDependencies = ConsulterProjetDependencies &
  ListerProjetsEligiblesPreuveRecanditureDependencies &
  ConsulterCandidatureDependencies &
  ListerCandidaturesQueryDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterProjetQuery(dependencies);
  registerProjetsEligiblesPreuveRecanditureQuery(dependencies);
  registerConsulterCandidatureQuery(dependencies);
  registerListerCandidaturesQuery(dependencies);
};
