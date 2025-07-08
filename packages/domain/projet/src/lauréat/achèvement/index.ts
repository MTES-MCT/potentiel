import {
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
} from './consulter/consulterAchèvement.query';

// Query
export type AchèvementQuery = ConsulterAchèvementQuery;

export type { ConsulterAchèvementQuery };

// ReadModel
export type { ConsulterAchèvementReadModel };

// Entity
export { AchèvementEntity } from './achèvement.entity';

// Attestation de conformité
export * as AttestationConformité from './attestationConformité';
