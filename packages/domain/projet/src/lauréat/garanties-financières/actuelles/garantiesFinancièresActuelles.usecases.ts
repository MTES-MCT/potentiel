import { EnregistrerGarantiesFinancièresUseCase } from './enregistrer/enregistrerGarantiesFinancières.usecase';
import { EnregistrerAttestationGarantiesFinancièresUseCase } from './enregistrerAttestation/enregistrerAttestationGarantiesFinancières.usecase';
import { ModifierGarantiesFinancièresUseCase } from './modifier/modifierGarantiesFinancières.usecase';

// UseCases
export type GarantiesFinancièresUseCases =
  | ModifierGarantiesFinancièresUseCase
  | EnregistrerAttestationGarantiesFinancièresUseCase
  | EnregistrerGarantiesFinancièresUseCase;

export {
  ModifierGarantiesFinancièresUseCase,
  EnregistrerAttestationGarantiesFinancièresUseCase,
  EnregistrerGarantiesFinancièresUseCase,
};
