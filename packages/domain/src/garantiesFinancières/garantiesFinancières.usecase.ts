import { DéposerGarantiesFinancièresUseCase } from './dépôt/déposerGarantiesFinancières.usecase';
import { ModifierDépôtGarantiesFinancièresUseCase } from './dépôt/modifierdépôtGarantiesFinancières.usecase';

export type DépôtGarantiesFinancièresUseCase =
  | DéposerGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresUseCase;
