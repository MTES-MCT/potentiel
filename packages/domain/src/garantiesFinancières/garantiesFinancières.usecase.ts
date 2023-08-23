import { EnregistrerGarantiesFinancièresUseCase } from './actuelles/enregistrerGarantiesFinancières.usecase';
import { DéposerGarantiesFinancièresUseCase } from './dépôt/déposerGarantiesFinancières.usecase';
import { ModifierDépôtGarantiesFinancièresUseCase } from './dépôt/modifierdépôtGarantiesFinancières.usecase';
import { ValiderDépôtGarantiesFinancièresUseCase } from './dépôt/validerDépôtGarantiesFinancières.usecase';
import { SupprimerDépôtGarantiesFinancièresUseCase } from './dépôt/supprimerDépôtGarantiesFinancières.usecase';
export type GarantiesFinancièresUseCase =
  | DéposerGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresUseCase
  | EnregistrerGarantiesFinancièresUseCase
  | ValiderDépôtGarantiesFinancièresUseCase
  | SupprimerDépôtGarantiesFinancièresUseCase;
