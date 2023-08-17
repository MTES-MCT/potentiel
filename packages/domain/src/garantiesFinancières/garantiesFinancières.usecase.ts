import { EnregistrerGarantiesFinancièresUseCase } from './actuelles/enregistrerGarantiesFinancières.usecase';
import { DéposerGarantiesFinancièresUseCase } from './dépôt/déposerGarantiesFinancières.usecase';
import { ModifierDépôtGarantiesFinancièresUseCase } from './dépôt/modifierdépôtGarantiesFinancières.usecase';

export type GarantiesFinancièresUseCase =
  | DéposerGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresUseCase
  | EnregistrerGarantiesFinancièresUseCase;
