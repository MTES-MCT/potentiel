import {
  ConsulterNombreTâchesQueryDependencies,
  registerConsulterNombreTâchesQuery,
} from './consulter/consulterNombreTâche.query';
import {
  ListerTâchesQueryDependencies,
  registerListerTâchesQuery,
} from './lister/listerTâche.query';

export type TâcheQueryDependencies = ConsulterNombreTâchesQueryDependencies &
  ListerTâchesQueryDependencies;

export const registerTâcheQuery = (dependencies: TâcheQueryDependencies) => {
  registerConsulterNombreTâchesQuery(dependencies);
  registerListerTâchesQuery(dependencies);
};
