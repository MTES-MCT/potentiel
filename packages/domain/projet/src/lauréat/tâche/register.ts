import {
  ConsulterNombreTâchesQueryDependencies,
  registerConsulterNombreTâchesQuery,
} from './consulter/consulterNombreTâche.query.js';
import {
  ListerTâchesQueryDependencies,
  registerListerTâchesQuery,
} from './lister/listerTâche.query.js';

export type TâcheQueryDependencies = ConsulterNombreTâchesQueryDependencies &
  ListerTâchesQueryDependencies;

export const registerTâcheQuery = (dependencies: TâcheQueryDependencies) => {
  registerConsulterNombreTâchesQuery(dependencies);
  registerListerTâchesQuery(dependencies);
};
