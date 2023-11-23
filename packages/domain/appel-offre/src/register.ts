import {
  ConsulterAppelOffreDependencies,
  registerConsulterAppelOffreQuery,
} from './consulter/consulterAppelOffre.query';
import {
  ListerAppelOffreDependencies,
  registerListerAppelOffreQuery,
} from './lister/listerAppelOffre.query';

type AppelOffreQueryDependencies = ListerAppelOffreDependencies & ConsulterAppelOffreDependencies;

export const registerAppelOffreQueries = (dependencies: AppelOffreQueryDependencies) => {
  registerListerAppelOffreQuery(dependencies);
  registerConsulterAppelOffreQuery(dependencies);
};
