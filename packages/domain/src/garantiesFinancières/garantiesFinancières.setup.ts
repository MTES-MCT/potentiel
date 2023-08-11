import {
  DéposerGarantiesFinancièresDependencies,
  registerDéposerGarantiesFinancièresCommand,
} from './dépôt/déposerGarantiesFinancières.command';
import { registerDéposerGarantiesFinancièresUseCase } from './dépôt/déposerGarantiesFinancières.usecase';
import {
  ModifierDépôtGarantiesFinancièresDependencies,
  registerModifierDépôtGarantiesFinancièresCommand,
} from './dépôt/modifierDépôtGarantiesFinancières.command';
import { registerModifierDépôtGarantiesFinancièresUseCase } from './dépôt/modifierdépôtGarantiesFinancières.usecase';

export type DépôtGarantiesFinancièresDependencies = DéposerGarantiesFinancièresDependencies &
  ModifierDépôtGarantiesFinancièresDependencies;

export const setupDépôtGarantiesFinancières = async (
  dependencies: DépôtGarantiesFinancièresDependencies,
) => {
  // commands
  registerDéposerGarantiesFinancièresCommand(dependencies);
  registerModifierDépôtGarantiesFinancièresCommand(dependencies);

  // usecases
  registerDéposerGarantiesFinancièresUseCase();
  registerModifierDépôtGarantiesFinancièresUseCase();
};
