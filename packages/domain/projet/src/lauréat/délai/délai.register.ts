import {
  ConsulterDélaiDependencies,
  registerConsulterDélai,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';

export type DélaiQueryDependencies = ConsulterDélaiDependencies;

export const registerDélaiQueries = (dependencies: DélaiQueryDependencies) => {
  registerConsulterDélai(dependencies);
};
