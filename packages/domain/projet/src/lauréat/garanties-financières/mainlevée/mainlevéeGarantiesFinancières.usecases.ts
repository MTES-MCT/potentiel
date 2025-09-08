import { AccorderMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderMainlevéeGarantiesFinancières.usecase';
import { AnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase';
import { DemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase';
import { DémarrerInstructionMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.usecase';
import { RejeterMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase';

// UseCases
export type MainlevéeGarantiesFinancièresUseCases =
  | DemanderMainlevéeGarantiesFinancièresUseCase
  | AnnulerMainlevéeGarantiesFinancièresUseCase
  | DémarrerInstructionMainlevéeGarantiesFinancièresUseCase
  | AccorderMainlevéeGarantiesFinancièresUseCase
  | RejeterMainlevéeGarantiesFinancièresUseCase;

export {
  DemanderMainlevéeGarantiesFinancièresUseCase,
  AnnulerMainlevéeGarantiesFinancièresUseCase,
  DémarrerInstructionMainlevéeGarantiesFinancièresUseCase,
  AccorderMainlevéeGarantiesFinancièresUseCase,
  RejeterMainlevéeGarantiesFinancièresUseCase,
};
