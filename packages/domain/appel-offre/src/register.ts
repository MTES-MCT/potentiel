import {
  ListerAppelOffreDependencies,
  registerListerAppelOffreQuery,
} from './lister/listerAppelOffre.query';

type AppelOffreQueryDependencies = ListerAppelOffreDependencies;

export const registerAppelOffreQueries = (dependencies: AppelOffreQueryDependencies) => {
  registerListerAppelOffreQuery(dependencies);
};
