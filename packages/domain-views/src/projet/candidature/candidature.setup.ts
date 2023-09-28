import {
  ConsulterCandidatureLegacyDependencies,
  registerConsulterCandidatureLegacyQuery,
} from './consulter/consulterCandidatureLegacy.query';

export type CandidatureDependencies = ConsulterCandidatureLegacyDependencies;

export const setupCandidatureViews = async (dependencies: CandidatureDependencies) => {
  registerConsulterCandidatureLegacyQuery(dependencies);
};
