import { EnregistrerGarantiesFinancièresUseCase } from './actuelles/enregistrerGarantiesFinancières.usecase';
import { DéposerGarantiesFinancièresUseCase } from './dépôt/déposerGarantiesFinancières.usecase';
import { ModifierDépôtGarantiesFinancièresUseCase } from './dépôt/modifierdépôtGarantiesFinancières.usecase';
import { ValiderDépôtGarantiesFinancièresUseCase } from './dépôt/validerDépôtGarantiesFinancières.usecase';
import { SupprimerDépôtGarantiesFinancièresUseCase } from './dépôt/supprimerDépôtGarantiesFinancières.usecase';
import { ImporterTypeGarantiesFinancièresUseCase } from './actuelles/importerTypeGarantiesFinancières.usecase';
export type GarantiesFinancièresUseCase =
  | EnregistrerGarantiesFinancièresUseCase
  | ImporterTypeGarantiesFinancièresUseCase
  | DéposerGarantiesFinancièresUseCase
  | ModifierDépôtGarantiesFinancièresUseCase
  | ValiderDépôtGarantiesFinancièresUseCase
  | SupprimerDépôtGarantiesFinancièresUseCase;
