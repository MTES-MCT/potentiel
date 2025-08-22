import {
  type ConsulterAppelOffreDependencies,
  registerConsulterAppelOffreQuery,
} from './consulter/consulterAppelOffre.query';
import {
  type ListerAppelOffreDependencies,
  registerListerAppelOffreQuery,
} from './lister/listerAppelOffre.query';

type AppelOffreQueryDependencies = ListerAppelOffreDependencies & ConsulterAppelOffreDependencies;

export const registerAppelOffreQueries = (dependencies: AppelOffreQueryDependencies) => {
  registerListerAppelOffreQuery(dependencies);
  registerConsulterAppelOffreQuery(dependencies);
};
