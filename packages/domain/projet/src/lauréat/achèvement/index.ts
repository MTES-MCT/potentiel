import {
  ConsulterAttestationConformitéQuery,
  ConsulterAttestationConformitéReadModel,
} from './consulter/consulterAttestationConformité.query';
import { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';
import { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

// UseCases
export type AttestationConformitéUseCase =
  | TransmettreAttestationConformitéUseCase
  | ModifierAttestationConformitéUseCase;

export { TransmettreAttestationConformitéUseCase, ModifierAttestationConformitéUseCase };

// Query
export type AttestationConformitéQuery = ConsulterAttestationConformitéQuery;

export { ConsulterAttestationConformitéQuery };

// ReadModel
export { ConsulterAttestationConformitéReadModel };

// Events
export * from './transmettre/transmettreAttestationConformité.event';
export * from './modifier/modifierAttestationConformité.event';

// ValueTypes
export * as TypeDocumentAchèvement from './typeDocumentAchèvement.valueType';

// Entities
export * from './achèvement.entity';

// Errors
export * from './achèvement.error';
