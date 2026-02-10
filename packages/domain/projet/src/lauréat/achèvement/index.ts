import {
  ConsulterAchèvementAchevéReadModel,
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
} from './consulter/consulterAchèvement.query.js';
import {
  ListerProjetAvecAchevementATransmettreQuery,
  ListerProjetAvecAchevementATransmettreReadModel,
} from './lister/listerProjetAvecAchevementATransmettre.query.js';
import { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase.js';
import { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase.js';
import { TransmettreDateAchèvementUseCase } from './transmettre/transmettreDateAchèvement.usecase.js';

// UseCases
export type AchèvementUseCase =
  | TransmettreAttestationConformitéUseCase
  | ModifierAttestationConformitéUseCase
  | TransmettreDateAchèvementUseCase;

export type {
  TransmettreAttestationConformitéUseCase,
  ModifierAttestationConformitéUseCase,
  TransmettreDateAchèvementUseCase,
};

// Query
export type AchèvementQuery =
  | ConsulterAchèvementQuery
  | ListerProjetAvecAchevementATransmettreQuery;

export type { ConsulterAchèvementQuery, ListerProjetAvecAchevementATransmettreQuery };

// ReadModel
export type {
  ConsulterAchèvementReadModel,
  ConsulterAchèvementAchevéReadModel,
  ListerProjetAvecAchevementATransmettreReadModel,
};

// Entity
export type { AchèvementEntity } from './achèvement.entity.js';

// ValueTypes
export * as DateAchèvementPrévisionnel from './dateAchèvementPrévisionnel.valueType.js';
export * as TypeTâchePlanifiéeAchèvement from './typeTâchePlanifiéeAchèvement.valueType.js';
export * as TypeDocumentAttestationConformité from './typeDocumentAttestationConformité.valueType.js';

// Event
export type * from './achèvement.event.js';
