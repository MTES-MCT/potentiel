import {
  ListerTâchesQueryDependencies,
  registerListerTâchesQuery,
} from './lister/listerTâche.query';

export type TâcheQueryDependencies = ListerTâchesQueryDependencies;

export const registerTâcheQuery = (dependencies: TâcheQueryDependencies) => {
  registerListerTâchesQuery(dependencies);
};
