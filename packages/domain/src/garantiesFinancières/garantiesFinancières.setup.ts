import {
  DéposerGarantiesFinancièresDependencies,
  registerDéposerGarantiesFinancièresCommand,
} from './déposerGarantiesFinancières.command';
import { registerDéposerGarantiesFinancièresUseCase } from './déposerGarantiesFinancières.usecase';
import {
  ModifierDépôtGarantiesFinancièresDependencies,
  registerModifierDépôtGarantiesFinancièresCommand,
} from './modifierDépôtGarantiesFinancières.command';
import { registerModifierDépôtGarantiesFinancièresUseCase } from './modifierdépôtGarantiesFinancières.usecase';

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
