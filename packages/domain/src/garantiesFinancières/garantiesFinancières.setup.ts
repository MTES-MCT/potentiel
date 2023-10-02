import { registerEnregistrerGarantiesFinancièresUseCase } from './actuelles/enregistrerGarantiesFinancières.usecase';
import {
  EnregistrerGarantiesFinancièresDependencies,
  registerEnregistrerGarantiesFinancièresCommand,
} from './actuelles/enregistrerGarantiesFinancières.command';
import {
  ImporterTypeGarantiesFinancièresDependencies,
  registerImporterTypeGarantiesFinancièresCommand,
} from './actuelles/importerTypeGarantiesFinancières.command';
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
import {
  SupprimerDépôtGarantiesFinancièresDependencies,
  registerSupprimerDépôtGarantiesFinancièresCommand,
} from './dépôt/supprimerDépôtGarantiesFinancières.command';
import { registerSupprimerDépôtGarantiesFinancièresUseCase } from './dépôt/supprimerDépôtGarantiesFinancières.usecase';
import {
  ValiderDépôtarantiesFinancièresDependencies,
  registerValiderDépôtGarantiesFinancièresCommand,
} from './dépôt/validerDépôtGarantiesFinancières.command';
import { registerValiderDépôtGarantiesFinancièresUseCase } from './dépôt/validerDépôtGarantiesFinancières.usecase';
import { registerImporterTypeGarantiesFinancièresUseCase } from './actuelles/importerTypeGarantiesFinancières.usecase';

export type GarantiesFinancièresDependencies = EnregistrerGarantiesFinancièresDependencies &
  ImporterTypeGarantiesFinancièresDependencies &
  DéposerGarantiesFinancièresDependencies &
  ModifierDépôtGarantiesFinancièresDependencies &
  ValiderDépôtarantiesFinancièresDependencies &
  SupprimerDépôtGarantiesFinancièresDependencies;

export const setupGarantiesFinancières = async (dependencies: GarantiesFinancièresDependencies) => {
  // commands
  registerEnregistrerGarantiesFinancièresCommand(dependencies);
  registerImporterTypeGarantiesFinancièresCommand(dependencies);
  registerDéposerGarantiesFinancièresCommand(dependencies);
  registerModifierDépôtGarantiesFinancièresCommand(dependencies);
  registerValiderDépôtGarantiesFinancièresCommand(dependencies);
  registerSupprimerDépôtGarantiesFinancièresCommand(dependencies);

  // usecases
  registerEnregistrerGarantiesFinancièresUseCase();
  registerImporterTypeGarantiesFinancièresUseCase();
  registerDéposerGarantiesFinancièresUseCase();
  registerModifierDépôtGarantiesFinancièresUseCase();
  registerValiderDépôtGarantiesFinancièresUseCase();
  registerSupprimerDépôtGarantiesFinancièresUseCase();
};
