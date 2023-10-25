import {
  ConsulterCandidatureDependencies,
  registerConsulterDocumentProjetQuery,
} from './consulter/consulterCandidature.query';

type CandidatureQueryDependencies = ConsulterCandidatureDependencies;

export const registerCandidatureQueries = (dependencies: CandidatureQueryDependencies) => {
  registerConsulterDocumentProjetQuery(dependencies);
};
