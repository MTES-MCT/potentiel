import { GetProjetAggregateRoot } from '../../..';

import { registerAccorderMainlevéeGarantiesFinancièresCommand } from './accorder/accorderMainlevéeGarantiesFinancières.command';
import { registerAccorderMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderMainlevéeGarantiesFinancières.usecase';
import { registerAnnulerMainlevéeGarantiesFinancièresCommand } from './annuler/annulerDemandeMainlevéeGarantiesFinancières.command';
import { registerAnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase';
import { registerDemanderMainlevéeGarantiesFinancièresCommand } from './demander/demanderMainlevéeGarantiesFinancières.command';
import { registerDemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase';
import { registerDémarrerInstructionMainlevéeGarantiesFinancièresCommand } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.command';
import { registerDémarrerInstructionMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.usecase';

export type MainlevéeGarantiesFinancièresQueryDependencies = {};

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

  registerDemanderMainlevéeGarantiesFinancièresUseCase();
  registerAnnulerMainlevéeGarantiesFinancièresUseCase();
  registerDémarrerInstructionMainlevéeGarantiesFinancièresUseCase();
  registerAccorderMainlevéeGarantiesFinancièresUseCase();
};

export const registerMainlevéeGarantiesFinancièresQueries = (
  _: MainlevéeGarantiesFinancièresQueryDependencies,
) => {};
