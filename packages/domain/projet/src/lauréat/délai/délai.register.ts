import type { GetProjetAggregateRoot } from '../..';
import {
  type ConsulterDélaiDependencies,
  registerConsulterDélai,
} from './consulter/consulterABénéficiéDuDélaiCDC2022.query';
import { registerAccorderDemandeDélaiCommand } from './demande/accorder/accorderDemandeDélai.command';
import { registerAccorderDemandeDélaiUseCase } from './demande/accorder/accorderDemandeDélai.usecase';
import { registerAnnulerDemandeDélaiCommand } from './demande/annuler/annulerDemandeDélai.command';
import { registerAnnulerDemandeDélaiUseCase } from './demande/annuler/annulerDemandeDélai.usecase';
import {
  type ConsulterDemandeDélaiDependencies,
  registerConsulterDemandeDélaiQuery,
} from './demande/consulter/consulterDemandeDélai.query';
import { registerCorrigerDemandeDélaiCommand } from './demande/corriger/corrigerDemandeDélai.command';
import { registerCorrigerDemandeDélaiUseCase } from './demande/corriger/corrigerDemandeDélai.usecase';
import { registerDemanderDélaiDélaiCommand } from './demande/demander/demanderDélai.command';
import { registerDemanderDélaiDélaiUseCase } from './demande/demander/demanderDélai.usecase';
import { registerPasserEnInstructionDemandeDélaiCommand } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.command';
import { registerPasserEnInstructionDemandeDélaiUseCase } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.usecase';
import { registerRejeterDemandeDélaiCommand } from './demande/rejeter/rejeterDemandeDélai.command';
import { registerRejeterDemandeDélaiUseCase } from './demande/rejeter/rejeterDemandeDélai.usecase';
import {
  type ListerDemandeDélaiDependencies,
  registerListerDemandeDélaiQuery,
} from './lister/listerDemandeDélai.query';
import {
  type ListerHistoriqueDélaiProjetDependencies,
  registerListerHistoriqueDélaiProjetQuery,
} from './lister/listerHistoriqueDélaiProjet.query';

export type DélaiCommandDependencies = { getProjetAggregateRoot: GetProjetAggregateRoot };

export const registerDélaiUseCases = ({ getProjetAggregateRoot }: DélaiCommandDependencies) => {
  registerDemanderDélaiDélaiUseCase();
  registerAnnulerDemandeDélaiUseCase();
  registerPasserEnInstructionDemandeDélaiUseCase();
  registerRejeterDemandeDélaiUseCase();
  registerAccorderDemandeDélaiUseCase();
  registerCorrigerDemandeDélaiUseCase();

  registerDemanderDélaiDélaiCommand(getProjetAggregateRoot);
  registerAnnulerDemandeDélaiCommand(getProjetAggregateRoot);
  registerPasserEnInstructionDemandeDélaiCommand(getProjetAggregateRoot);
  registerRejeterDemandeDélaiCommand(getProjetAggregateRoot);
  registerAccorderDemandeDélaiCommand(getProjetAggregateRoot);
  registerCorrigerDemandeDélaiCommand(getProjetAggregateRoot);
};

export type DélaiQueryDependencies = ConsulterDélaiDependencies &
  ConsulterDemandeDélaiDependencies &
  ListerDemandeDélaiDependencies &
  ListerHistoriqueDélaiProjetDependencies;

export const registerDélaiQueries = (dependencies: DélaiQueryDependencies) => {
  registerConsulterDélai(dependencies);
  registerConsulterDemandeDélaiQuery(dependencies);
  registerListerDemandeDélaiQuery(dependencies);
  registerListerHistoriqueDélaiProjetQuery(dependencies);
};
