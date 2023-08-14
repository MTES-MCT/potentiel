import { DéposerGarantiesFinancièresUseCase } from './déposerGarantiesFinancières.usecase';
import { ModifierDépôtGarantiesFinancièresUseCase } from './modifierdépôtGarantiesFinancières.usecase';

export type DépôtGarantiesFinancièresUseCase =
  | DéposerGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresUseCase;
