import {
  ConsulterCandidatureDependencies,
  registerConsulterCandidatureQuery,
} from './consulter/consulterCandidature.query';
import {
  ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurDependencies,
  registerListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery,
} from './lister/listerCandidaturesNotifiéesEtNonAbandonnéesParPorteur.query';

type CandidatureQueryDependencies = ConsulterCandidatureDependencies &
  ListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterCandidatureQuery(dependencies);
  registerListerCandidaturesNotifiéesEtNonAbandonnéesParPorteurQuery(dependencies);
};
