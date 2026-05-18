import { GetProjetAggregateRoot } from '../../../index.js';
import { registerAccorderMainlevéeGarantiesFinancièresCommand } from './accorder/accorderMainlevéeGarantiesFinancières.command.js';
import { registerAccorderMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderMainlevéeGarantiesFinancières.usecase.js';
import { registerAnnulerMainlevéeGarantiesFinancièresCommand } from './annuler/annulerDemandeMainlevéeGarantiesFinancières.command.js';
import { registerAnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase.js';
import { registerConsulterMainlevéeEnCoursQuery } from './consulter/consulterMainlevéeEnCours.query.js';
import { registerDemanderMainlevéeGarantiesFinancièresCommand } from './demander/demanderMainlevéeGarantiesFinancières.command.js';
import { registerDemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase.js';
import { registerDémarrerInstructionMainlevéeGarantiesFinancièresCommand } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.command.js';
import { registerDémarrerInstructionMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.usecase.js';
import {
  ListerMainlevéesQueryDependencies,
  registerListerMainlevéesQuery,
} from './lister/listerMainlevéesGarantiesFinancières.query.js';
import { registerRejeterMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase.js';
import { registerRejeterMainlevéeGarantiesFinancièresCommand } from './rejeter/rejeterMainlevéeGarantiesFinancières.command.js';

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
  registerConsulterMainlevéeEnCoursQuery(dependencies);
};
