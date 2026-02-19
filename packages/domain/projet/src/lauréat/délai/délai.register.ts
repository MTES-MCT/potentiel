import { GetProjetAggregateRoot } from '../../index.js';

import { registerAccorderDemandeDélaiUseCase } from './demande/accorder/accorderDemandeDélai.usecase.js';
import { registerAccorderDemandeDélaiCommand } from './demande/accorder/accorderDemandeDélai.command.js';
import { registerAnnulerDemandeDélaiCommand } from './demande/annuler/annulerDemandeDélai.command.js';
import { registerAnnulerDemandeDélaiUseCase } from './demande/annuler/annulerDemandeDélai.usecase.js';
import {
  ConsulterDemandeDélaiDependencies,
  registerConsulterDemandeDélaiQuery,
} from './demande/consulter/consulterDemandeDélai.query.js';
import { registerDemanderDélaiDélaiCommand } from './demande/demander/demanderDélai.command.js';
import { registerDemanderDélaiDélaiUseCase } from './demande/demander/demanderDélai.usecase.js';
import { registerRejeterDemandeDélaiCommand } from './demande/rejeter/rejeterDemandeDélai.command.js';
import { registerRejeterDemandeDélaiUseCase } from './demande/rejeter/rejeterDemandeDélai.usecase.js';
import { registerPasserEnInstructionDemandeDélaiCommand } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.command.js';
import { registerPasserEnInstructionDemandeDélaiUseCase } from './demande/passer-en-instruction/passerEnInstructionDemandeDélai.usecase.js';
import {
  ListerHistoriqueDélaiProjetDependencies,
  registerListerHistoriqueDélaiProjetQuery,
} from './lister/listerHistoriqueDélaiProjet.query.js';
import { registerCorrigerDemandeDélaiUseCase } from './demande/corriger/corrigerDemandeDélai.usecase.js';
import { registerCorrigerDemandeDélaiCommand } from './demande/corriger/corrigerDemandeDélai.command.js';
import {
  ListerDemandeDélaiDependencies,
  registerListerDemandeDélaiQuery,
} from './demande/lister/listerDemandeDélai.query.js';

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

export type DélaiQueryDependencies = ConsulterDemandeDélaiDependencies &
  ListerDemandeDélaiDependencies &
  ListerHistoriqueDélaiProjetDependencies;

export const registerDélaiQueries = (dependencies: DélaiQueryDependencies) => {
  registerConsulterDemandeDélaiQuery(dependencies);
  registerListerDemandeDélaiQuery(dependencies);
  registerListerHistoriqueDélaiProjetQuery(dependencies);
};
