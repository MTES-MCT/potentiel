import { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './modifier/modifierDépôtGarantiesFinancières.usecase';
import { SoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase';
import { SupprimerDépôtGarantiesFinancièresUseCase } from './supprimer/supprimerDépôtGarantiesFinancières.usecase';
import { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './valider/validerDépôtGarantiesFinancières.usecase';

// UseCases
export type DépôtGarantiesFinancièresUseCases =
  | SoumettreDépôtGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresEnCoursUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase
  | SupprimerDépôtGarantiesFinancièresUseCase;

export {
  SoumettreDépôtGarantiesFinancièresUseCase,
  ModifierDépôtGarantiesFinancièresEnCoursUseCase,
  ValiderDépôtGarantiesFinancièresEnCoursUseCase,
  SupprimerDépôtGarantiesFinancièresUseCase,
};
