import { GetProjetAggregateRoot } from '../..';

import {
  ConsulterDélaiDependencies,
  registerConsulterDélai,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';
import { registerAnnulerDemandeDélaiCommand } from './demande/annuler/annulerDemandeDélai.command';
import { registerAnnulerDemandeDélaiUseCase } from './demande/annuler/annulerDemandeDélai.usecase';
import {
  ConsulterDemandeDélaiDependencies,
  registerConsulterDemandeDélaiQuery,
} from './demande/consulter/consulterDemandeDélai.query';
import { registerDemanderDélaiDélaiCommand } from './demande/demander/demanderDélai.command';
import { registerDemanderDélaiDélaiUseCase } from './demande/demander/demanderDélai.usecase';
import { registerRejeterDemandeDélaiCommand } from './demande/rejeter/rejeterDemandeDélai.command';
import { registerRejeterDemandeDélaiUseCase } from './demande/rejeter/rejeterDemandeDélai.usecase';
import {
  ListerDemandeDélaiDependencies,
  registerListerDemandeDélaiQuery,
} from './lister/listerDemandeDélai.query';

export type DélaiCommandDependencies = { getProjetAggregateRoot: GetProjetAggregateRoot };

export const registerDélaiUseCases = ({ getProjetAggregateRoot }: DélaiCommandDependencies) => {
  registerDemanderDélaiDélaiUseCase();
  registerAnnulerDemandeDélaiUseCase();
  registerRejeterDemandeDélaiUseCase();

  registerDemanderDélaiDélaiCommand(getProjetAggregateRoot);
  registerAnnulerDemandeDélaiCommand(getProjetAggregateRoot);
  registerRejeterDemandeDélaiCommand(getProjetAggregateRoot);
};

export type DélaiQueryDependencies = ConsulterDélaiDependencies &
  ConsulterDemandeDélaiDependencies &
  ListerDemandeDélaiDependencies;

export const registerDélaiQueries = (dependencies: DélaiQueryDependencies) => {
  registerConsulterDélai(dependencies);
  registerConsulterDemandeDélaiQuery(dependencies);
  registerListerDemandeDélaiQuery(dependencies);
};
