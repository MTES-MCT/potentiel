import { AccorderMainlevéeGarantiesFinancièresUseCase } from './accorder/accorderMainlevéeGarantiesFinancières.usecase.js';
import { AnnulerMainlevéeGarantiesFinancièresUseCase } from './annuler/annulerMainlevéeGarantiesFinancières.usecase.js';
import { DemanderMainlevéeGarantiesFinancièresUseCase } from './demander/demanderMainlevéeGarantiesFinancières.usecase.js';
import { DémarrerInstructionMainlevéeGarantiesFinancièresUseCase } from './démarrerInstruction/démarrerInstructionMainlevéeGarantiesFinancières.usecase.js';
import { RejeterMainlevéeGarantiesFinancièresUseCase } from './rejeter/rejeterDemandeMainlevéeGarantiesFinancières.usecase.js';

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
