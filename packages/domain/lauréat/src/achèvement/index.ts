import {
  ConsulterAttestationConformitéQuery,
  ConsulterAttestationConformitéReadModel,
} from './consulter/consulterAttestationConformité.query';
import { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';
import { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

// Query
export type AttestationConformitéQuery = ConsulterAttestationConformitéQuery;

export { ConsulterAttestationConformitéQuery };

// ReadModel
export { ConsulterAttestationConformitéReadModel };

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

// ValueTypes
export * as TypeDocumentAchèvement from './typeDocumentAchèvement.valueType';

// Entities
export * from './achèvement.entity';
