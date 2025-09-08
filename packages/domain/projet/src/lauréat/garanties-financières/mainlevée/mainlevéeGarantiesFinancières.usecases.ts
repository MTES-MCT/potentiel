import { AccorderMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderMainlevéeGarantiesFinancières.usecase';
import { AnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase';
import { DemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase';
import { DémarrerInstructionMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.usecase';

// UseCases
export type MainlevéeGarantiesFinancièresUseCases =
  | DemanderMainlevéeGarantiesFinancièresUseCase
  | AnnulerMainlevéeGarantiesFinancièresUseCase
  | DémarrerInstructionMainlevéeGarantiesFinancièresUseCase
  | AccorderMainlevéeGarantiesFinancièresUseCase;

export {
  DemanderMainlevéeGarantiesFinancièresUseCase,
  AnnulerMainlevéeGarantiesFinancièresUseCase,
  DémarrerInstructionMainlevéeGarantiesFinancièresUseCase,
  AccorderMainlevéeGarantiesFinancièresUseCase,
};
