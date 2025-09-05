import { AnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase';
import { DemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase';

// UseCases
export type MainlevéeGarantiesFinancièresUseCases =
  | DemanderMainlevéeGarantiesFinancièresUseCase
  | AnnulerMainlevéeGarantiesFinancièresUseCase;

export {
  DemanderMainlevéeGarantiesFinancièresUseCase,
  AnnulerMainlevéeGarantiesFinancièresUseCase,
};
