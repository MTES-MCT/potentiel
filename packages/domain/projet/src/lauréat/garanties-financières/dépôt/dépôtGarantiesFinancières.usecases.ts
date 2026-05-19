import type { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './modifier/modifierDépôtGarantiesFinancières.usecase.js';
import type { SoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase.js';
import type { SupprimerDépôtGarantiesFinancièresUseCase } from './supprimer/supprimerDépôtGarantiesFinancières.usecase.js';
import type { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './valider/validerDépôtGarantiesFinancières.usecase.js';

// UseCases
export type DépôtGarantiesFinancièresUseCases =
  | SoumettreDépôtGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresEnCoursUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase
  | SupprimerDépôtGarantiesFinancièresUseCase;

export type {
  ModifierDépôtGarantiesFinancièresEnCoursUseCase,
  SoumettreDépôtGarantiesFinancièresUseCase,
  SupprimerDépôtGarantiesFinancièresUseCase,
  ValiderDépôtGarantiesFinancièresEnCoursUseCase,
};
