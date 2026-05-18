import {
  type ConsulterAppelOffreDependencies,
  registerConsulterAppelOffreQuery,
} from './consulter/consulterAppelOffre.query.js';
import {
  type ListerAppelOffreDependencies,
  registerListerAppelOffreQuery,
} from './lister/listerAppelOffre.query.js';

type AppelOffreQueryDependencies = ListerAppelOffreDependencies & ConsulterAppelOffreDependencies;

export const registerAppelOffreQueries = (dependencies: AppelOffreQueryDependencies) => {
  registerListerAppelOffreQuery(dependencies);
  registerConsulterAppelOffreQuery(dependencies);
};
