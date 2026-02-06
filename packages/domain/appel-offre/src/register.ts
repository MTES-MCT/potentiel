import {
  ConsulterAppelOffreDependencies,
  registerConsulterAppelOffreQuery,
} from './consulter/consulterAppelOffre.query.js';
import {
  ListerAppelOffreDependencies,
  registerListerAppelOffreQuery,
} from './lister/listerAppelOffre.query.js';

type AppelOffreQueryDependencies = ListerAppelOffreDependencies & ConsulterAppelOffreDependencies;

export const registerAppelOffreQueries = (dependencies: AppelOffreQueryDependencies) => {
  registerListerAppelOffreQuery(dependencies);
  registerConsulterAppelOffreQuery(dependencies);
};
