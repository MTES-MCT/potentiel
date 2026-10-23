import type { AccorderDemandeMainlevéeGarantiesFinancièresUseCase } from './accorderDemande/accorderDemandeMainlevéeGarantiesFinancières.usecase.js';
import type { AnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase.js';
import type { DemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase.js';
import type { DémarrerInstructionMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.usecase.js';
import type { RejeterMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase.js';

// UseCases
export type MainlevéeGarantiesFinancièresUseCases =
  | DemanderMainlevéeGarantiesFinancièresUseCase
  | AnnulerMainlevéeGarantiesFinancièresUseCase
  | DémarrerInstructionMainlevéeGarantiesFinancièresUseCase
  | AccorderDemandeMainlevéeGarantiesFinancièresUseCase
  | RejeterMainlevéeGarantiesFinancièresUseCase;

export type {
  AccorderDemandeMainlevéeGarantiesFinancièresUseCase,
  AnnulerMainlevéeGarantiesFinancièresUseCase,
  DemanderMainlevéeGarantiesFinancièresUseCase,
  DémarrerInstructionMainlevéeGarantiesFinancièresUseCase,
  RejeterMainlevéeGarantiesFinancièresUseCase,
};
