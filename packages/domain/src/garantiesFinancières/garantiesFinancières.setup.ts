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

export type GarantiesFinancièresDependencies = DéposerGarantiesFinancièresDependencies &
  ModifierDépôtGarantiesFinancièresDependencies &
  EnregistrerTypeGarantiesFinancièresDependencies &
  EnregistrerAttestationGarantiesFinancièresDependencies &
  ValiderDépôtarantiesFinancièresDependencies &
  SupprimerDépôtGarantiesFinancièresDependencies;

export const setupGarantiesFinancières = async (dependencies: GarantiesFinancièresDependencies) => {
  // commands
  registerDéposerGarantiesFinancièresCommand(dependencies);
  registerModifierDépôtGarantiesFinancièresCommand(dependencies);
  registerEnregistrerTypeGarantiesFinancièresCommand(dependencies);
  registerEnregistrerAttestationGarantiesFinancièresCommand(dependencies);
  registerEnregistrerGarantiesFinancièresComplètesCommand(dependencies);
  registerValiderDépôtGarantiesFinancièresCommand(dependencies);
  registerSupprimerDépôtGarantiesFinancièresCommand(dependencies);

  // usecases
  registerDéposerGarantiesFinancièresUseCase();
  registerModifierDépôtGarantiesFinancièresUseCase();
  registerEnregistrerGarantiesFinancièresUseCase();
  registerValiderDépôtGarantiesFinancièresUseCase();
  registerSupprimerDépôtGarantiesFinancièresUseCase();
};
