import { GetProjetAggregateRoot } from '../../..';

import { registerAccorderMainlevéeGarantiesFinancièresCommand } from './accorder/accorderMainlevéeGarantiesFinancières.command';
import { registerAccorderMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderMainlevéeGarantiesFinancières.usecase';
import { registerAnnulerMainlevéeGarantiesFinancièresCommand } from './annuler/annulerDemandeMainlevéeGarantiesFinancières.command';
import { registerAnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase';
import { registerDemanderMainlevéeGarantiesFinancièresCommand } from './demander/demanderMainlevéeGarantiesFinancières.command';
import { registerDemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase';
import { registerDémarrerInstructionMainlevéeGarantiesFinancièresCommand } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.command';
import { registerDémarrerInstructionMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.usecase';
import { registerRejeterMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';
import { registerRejeterMainlevéeGarantiesFinancièresCommand } from './rejeter/rejeterMainlevéeGarantiesFinancières.command';
import {
  ListerMainlevéesQueryDependencies,
  registerListerMainlevéesQuery,
} from './lister/listerMainlevéesGarantiesFinancières.query';

export type MainlevéeGarantiesFinancièresQueryDependencies = ListerMainlevéesQueryDependencies;

export type MainlevéeGarantiesFinancièresUseCasesDependencies = {
  getProjetAggregateRoot: GetProjetAggregateRoot;
};

export const registerMainlevéeGarantiesFinancièresUseCases = ({
  getProjetAggregateRoot,
}: MainlevéeGarantiesFinancièresUseCasesDependencies) => {
  registerDemanderMainlevéeGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerAnnulerMainlevéeGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerDémarrerInstructionMainlevéeGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerAccorderMainlevéeGarantiesFinancièresCommand(getProjetAggregateRoot);
  registerRejeterMainlevéeGarantiesFinancièresCommand(getProjetAggregateRoot);

  registerDemanderMainlevéeGarantiesFinancièresUseCase();
  registerAnnulerMainlevéeGarantiesFinancièresUseCase();
  registerDémarrerInstructionMainlevéeGarantiesFinancièresUseCase();
  registerAccorderMainlevéeGarantiesFinancièresUseCase();
  registerRejeterMainlevéeGarantiesFinancièresUseCase();
};

export const registerMainlevéeGarantiesFinancièresQueries = (
  dependencies: MainlevéeGarantiesFinancièresQueryDependencies,
) => {
  registerListerMainlevéesQuery(dependencies);
};
