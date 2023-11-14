import {
  ListerAppelOffresDependencies,
  registerListerAppelOffresQuery,
} from './lister/listerAppelOffres.query';

type AppelOffresQueryDependencies = ListerAppelOffresDependencies;

export const registerAppelOffresQueries = (dependencies: AppelOffresQueryDependencies) => {
  registerListerAppelOffresQuery(dependencies);
};
