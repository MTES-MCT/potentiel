import { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './modifier/modifierDépôtGarantiesFinancières.usecase.js';
import { SoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase.js';
import { SupprimerDépôtGarantiesFinancièresUseCase } from './supprimer/supprimerDépôtGarantiesFinancières.usecase.js';
import { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './valider/validerDépôtGarantiesFinancières.usecase.js';

// UseCases
export type DépôtGarantiesFinancièresUseCases =
  | SoumettreDépôtGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresEnCoursUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase
  | SupprimerDépôtGarantiesFinancièresUseCase;

export type {
  SoumettreDépôtGarantiesFinancièresUseCase,
  ModifierDépôtGarantiesFinancièresEnCoursUseCase,
  ValiderDépôtGarantiesFinancièresEnCoursUseCase,
  SupprimerDépôtGarantiesFinancièresUseCase,
};
