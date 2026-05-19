import type {
  ConsulterAchèvementAchevéReadModel,
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
} from './consulter/consulterAchèvement.query.js';
import type { EnregistrerAttestationConformitéUseCase } from './enregistrer/enregistrerAttestationConformité.usecase.js';
import type {
  ListerProjetAvecAchevementATransmettreQuery,
  ListerProjetAvecAchevementATransmettreReadModel,
} from './lister/listerProjetAvecAchevementATransmettre.query.js';
import type { ModifierAchèvementUseCase } from './modifier/modifierAchèvement.usecase.js';
import type { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase.js';
import type { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase.js';
import type { TransmettreDateAchèvementUseCase } from './transmettre/transmettreDateAchèvement.usecase.js';

export type {
  EnregistrerAttestationConformitéUseCase,
  ModifierAchèvementUseCase,
  ModifierAttestationConformitéUseCase,
  TransmettreAttestationConformitéUseCase,
  TransmettreDateAchèvementUseCase,
};

// Query
export type AchèvementQuery =
  | ConsulterAchèvementQuery
  | ListerProjetAvecAchevementATransmettreQuery;

// Entity
export type { AchèvementEntity } from './achèvement.entity.js';
// Event
export type * from './achèvement.event.js';
// ValueTypes
export * as DateAchèvementPrévisionnel from './dateAchèvementPrévisionnel.valueType.js';
export * as DocumentAchèvement from './documentAchèvement.valueType.js';
export * as TypeTâchePlanifiéeAchèvement from './typeTâchePlanifiéeAchèvement.valueType.js';
// ReadModel
export type {
  ConsulterAchèvementAchevéReadModel,
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
  ListerProjetAvecAchevementATransmettreQuery,
  ListerProjetAvecAchevementATransmettreReadModel,
};
