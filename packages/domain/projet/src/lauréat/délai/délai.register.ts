import { GetProjetAggregateRoot } from '../..';

import {
  ConsulterDélaiDependencies,
  registerConsulterDélai,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';
import {
  ConsulterDemandeDélaiDependencies,
  registerConsulterDemandeDélaiQuery,
} from './demande/consulter/consulterDemandeDélai.query';
import { registerDemanderDélaiDélaiCommand } from './demande/demander/demanderDélai.command';
import { registerDemanderDélaiDélaiUseCase } from './demande/demander/demanderDélai.usecase';

export type DélaiCommandDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerDélaiUseCases = ({ getProjetAggregateRoot }: DélaiCommandDependencies) => {
  registerDemanderDélaiDélaiUseCase();

  registerDemanderDélaiDélaiCommand(getProjetAggregateRoot);
};

export type DélaiQueryDependencies = ConsulterDélaiDependencies & ConsulterDemandeDélaiDependencies;

export const registerDélaiQueries = (dependencies: DélaiQueryDependencies) => {
  registerConsulterDélai(dependencies);
  registerConsulterDemandeDélaiQuery(dependencies);
};
