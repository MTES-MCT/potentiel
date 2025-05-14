import { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';
import { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

// UseCases
export type AttestationConformitéUseCase =
  | TransmettreAttestationConformitéUseCase
  | ModifierAttestationConformitéUseCase;

export { TransmettreAttestationConformitéUseCase, ModifierAttestationConformitéUseCase };

// Event
export { AchèvementEvent } from './achèvement.aggregate';
export { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.behavior';

// Register
export { registerAchèvementUseCases } from './achèvement.register';
