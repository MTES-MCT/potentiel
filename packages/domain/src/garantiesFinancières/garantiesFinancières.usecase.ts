import { EnregistrerGarantiesFinancièresUseCase } from './actuelles/enregistrerGarantiesFinancières.usecase';
import { DéposerGarantiesFinancièresUseCase } from './dépôt/déposerGarantiesFinancières.usecase';
import { ModifierDépôtGarantiesFinancièresUseCase } from './dépôt/modifierdépôtGarantiesFinancières.usecase';
import { ValiderDépôtGarantiesFinancièresUseCase } from './dépôt/validerDépôtGarantiesFinancières.usecase';

export type GarantiesFinancièresUseCase =
  | DéposerGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresUseCase
  | EnregistrerGarantiesFinancièresUseCase
  | ValiderDépôtGarantiesFinancièresUseCase;
