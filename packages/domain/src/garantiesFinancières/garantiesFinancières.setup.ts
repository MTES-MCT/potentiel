import {
  EnregistrerAttestationGarantiesFinancièresDependencies,
  registerEnregistrerAttestationGarantiesFinancièresCommand,
} from './actuelles/enregistrerAttestationGarantiesFinancières.command';
import { registerEnregistrerGarantiesFinancièresUseCase } from './actuelles/enregistrerGarantiesFinancières.usecase';
import { registerEnregistrerGarantiesFinancièresComplètesCommand } from './actuelles/enregistrerGarantiesFinancièresComplètes.command';
import {
  EnregistrerTypeGarantiesFinancièresDependencies,
  registerEnregistrerTypeGarantiesFinancièresCommand,
} from './actuelles/enregistrerTypeGarantiesFinancières.command';
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

export type GarantiesFinancièresDependencies = DéposerGarantiesFinancièresDependencies &
  ModifierDépôtGarantiesFinancièresDependencies &
  EnregistrerTypeGarantiesFinancièresDependencies &
  EnregistrerAttestationGarantiesFinancièresDependencies;

export const setupDépôtGarantiesFinancières = async (
  dependencies: GarantiesFinancièresDependencies,
) => {
  // commands
  registerDéposerGarantiesFinancièresCommand(dependencies);
  registerModifierDépôtGarantiesFinancièresCommand(dependencies);
  registerEnregistrerTypeGarantiesFinancièresCommand(dependencies);
  registerEnregistrerAttestationGarantiesFinancièresCommand(dependencies);
  registerEnregistrerGarantiesFinancièresComplètesCommand(dependencies);

  // usecases
  registerDéposerGarantiesFinancièresUseCase();
  registerModifierDépôtGarantiesFinancièresUseCase();
  registerEnregistrerGarantiesFinancièresUseCase();
};
