import type { EnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase.js';
import type { EnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase.js';
import type { ModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase.js';

// UseCases
export type GarantiesFinancièresUseCases =
  | ModifierGarantiesFinancièresUseCase
  | EnregistrerAttestationGarantiesFinancièresUseCase
  | EnregistrerGarantiesFinancièresUseCase;

export type {
  EnregistrerAttestationGarantiesFinancièresUseCase,
  EnregistrerGarantiesFinancièresUseCase,
  ModifierGarantiesFinancièresUseCase,
};
