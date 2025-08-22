import {
  ConsulterAttestationConformitéQuery,
  ConsulterAttestationConformitéReadModel,
} from './consulter/consulterAttestationConformité.query';
import { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';
import { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';

// UseCases
export type AchèvementUseCase =
  | TransmettreAttestationConformitéUseCase
  | ModifierAttestationConformitéUseCase;

export { TransmettreAttestationConformitéUseCase, ModifierAttestationConformitéUseCase };

// Query
export type AttestationConformitéQuery = ConsulterAttestationConformitéQuery;

export { ConsulterAttestationConformitéQuery };

// ReadModel
export { ConsulterAttestationConformitéReadModel };

// Entities
export * from './attestationConformité.entity';
// Errors
export * from './attestationConformité.error';
// Events
export * from './attestationConformité.event';
export { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event';
export { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';
// ValueTypes
export * as TypeDocumentAttestationConformité from './typeDocumentAttestationConformité.valueType';
