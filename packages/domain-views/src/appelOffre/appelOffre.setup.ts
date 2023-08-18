import {
  ConsulterAppelOffreDependencies,
  registerConsulterAppelOffreQuery,
} from './consulter/consulterAppelOffre.query';

// Setup
type AppelOffreQueryDependencies = ConsulterAppelOffreDependencies;

export type AppelOffreDependencies = AppelOffreQueryDependencies;

export const setupAppelOffreViews = async (dependencies: AppelOffreDependencies) => {
  // Queries
  registerConsulterAppelOffreQuery(dependencies);

  return [];
};
