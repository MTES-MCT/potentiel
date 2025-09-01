import { ModifierDépôtGarantiesFinancièresEnCoursUseCase } from './modifier/modifierDépôtGarantiesFinancières.usecase';
import { SoumettreDépôtGarantiesFinancièresUseCase } from './soumettre/soumettreDépôtGarantiesFinancières.usecase';
import { ValiderDépôtGarantiesFinancièresEnCoursUseCase } from './valider/validerDépôtGarantiesFinancières.usecase';

// UseCases
export type DépôtGarantiesFinancièresUseCases =
  | SoumettreDépôtGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresEnCoursUseCase
  | ValiderDépôtGarantiesFinancièresEnCoursUseCase;

export {
  SoumettreDépôtGarantiesFinancièresUseCase,
  ModifierDépôtGarantiesFinancièresEnCoursUseCase,
  ValiderDépôtGarantiesFinancièresEnCoursUseCase,
};
