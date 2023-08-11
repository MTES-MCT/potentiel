import {
  ConsulterAppelOffreDependencies,
  registerConsulterAppelOffreQuery,
} from './consulterAppelOffre';

// Setup
type AppelOffreQueryDependencies = ConsulterAppelOffreDependencies;

export type AppelOffreDependencies = AppelOffreQueryDependencies;

export const setupAppelOffreViews = async (dependencies: AppelOffreDependencies) => {
  // Queries
  registerConsulterAppelOffreQuery(dependencies);

  return [];
};
