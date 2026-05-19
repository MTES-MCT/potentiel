import type { AccorderMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderMainlevéeGarantiesFinancières.usecase.js';
import type { AnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase.js';
import type { DemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase.js';
import type { DémarrerInstructionMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.usecase.js';
import type { RejeterMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase.js';

// UseCases
export type MainlevéeGarantiesFinancièresUseCases =
  | DemanderMainlevéeGarantiesFinancièresUseCase
  | AnnulerMainlevéeGarantiesFinancièresUseCase
  | DémarrerInstructionMainlevéeGarantiesFinancièresUseCase
  | AccorderMainlevéeGarantiesFinancièresUseCase
  | RejeterMainlevéeGarantiesFinancièresUseCase;

export type {
  AccorderMainlevéeGarantiesFinancièresUseCase,
  AnnulerMainlevéeGarantiesFinancièresUseCase,
  DemanderMainlevéeGarantiesFinancièresUseCase,
  DémarrerInstructionMainlevéeGarantiesFinancièresUseCase,
  RejeterMainlevéeGarantiesFinancièresUseCase,
};
