import {
  DéposerGarantiesFinancièresDependencies,
  registerDéposerGarantiesFinancièresCommand,
} from './déposerGarantiesFinancières.command';
import { registerDéposerGarantiesFinancièresUseCase } from './déposerGarantiesFinancières.usecase';

export type DépôtGarantiesFinancièresDependencies = DéposerGarantiesFinancièresDependencies;

export const setupDépôtGarantiesFinancières = async (
  dependencies: DépôtGarantiesFinancièresDependencies,
) => {
  // commands
  registerDéposerGarantiesFinancièresCommand(dependencies);

  // usecases
  registerDéposerGarantiesFinancièresUseCase();
};
