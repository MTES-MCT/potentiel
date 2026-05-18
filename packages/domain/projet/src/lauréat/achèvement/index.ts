import {
  ConsulterAchèvementAchevéReadModel,
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
} from './consulter/consulterAchèvement.query.js';
import { EnregistrerAttestationConformitéUseCase } from './enregistrer/enregistrerAttestationConformité.usecase.js';
import {
  ListerProjetAvecAchevementATransmettreQuery,
  ListerProjetAvecAchevementATransmettreReadModel,
} from './lister/listerProjetAvecAchevementATransmettre.query.js';
import { ModifierAchèvementUseCase } from './modifier/modifierAchèvement.usecase.js';
import { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase.js';
import { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase.js';
import { TransmettreDateAchèvementUseCase } from './transmettre/transmettreDateAchèvement.usecase.js';

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
