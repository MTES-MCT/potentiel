import { GetProjetAggregateRoot } from '../..';

import { registerAccorderDemandeDélaiUseCase } from './demande/accorder/accorderDemandeDélai.usecase';
import { registerAccorderDemandeDélaiCommand } from './demande/accorder/accorderDemandeDélai.command';
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
import { registerPasserEnInstructionDemandeDélaiCommand } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.command';
import { registerPasserEnInstructionDemandeDélaiUseCase } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.usecase';
import {
  ListerDemandeDélaiDependencies,
  registerListerDemandeDélaiQuery,
} from './lister/listerDemandeDélai.query';
import {
  ListerHistoriqueDélaiProjetDependencies,
  registerListerHistoriqueDélaiProjetQuery,
} from './lister/listerHistoriqueDélaiProjet.query';

export type DélaiCommandDependencies = { getProjetAggregateRoot: GetProjetAggregateRoot };

export const registerDélaiUseCases = ({ getProjetAggregateRoot }: DélaiCommandDependencies) => {
  registerDemanderDélaiDélaiUseCase();
  registerAnnulerDemandeDélaiUseCase();
  registerPasserEnInstructionDemandeDélaiUseCase();
  registerRejeterDemandeDélaiUseCase();
  registerAccorderDemandeDélaiUseCase();

  registerDemanderDélaiDélaiCommand(getProjetAggregateRoot);
  registerAnnulerDemandeDélaiCommand(getProjetAggregateRoot);
  registerPasserEnInstructionDemandeDélaiCommand(getProjetAggregateRoot);
  registerRejeterDemandeDélaiCommand(getProjetAggregateRoot);
  registerAccorderDemandeDélaiCommand(getProjetAggregateRoot);
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
