import {
  ConsulterAchèvementAchevéReadModel,
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
} from './consulter/consulterAchèvement.query';
import { ModifierAttestationConformitéUseCase } from './modifier/modifierAttestationConformité.usecase';
import { TransmettreAttestationConformitéUseCase } from './transmettre/transmettreAttestationConformité.usecase';
import { TransmettreDateAchèvementUseCase } from './transmettre/transmettreDateAchèvement.usecase';

// UseCases
export type AchèvementUseCase =
  | TransmettreAttestationConformitéUseCase
  | ModifierAttestationConformitéUseCase
  | TransmettreDateAchèvementUseCase;

export {
  TransmettreAttestationConformitéUseCase,
  ModifierAttestationConformitéUseCase,
  TransmettreDateAchèvementUseCase,
};

// Query
export type AchèvementQuery = ConsulterAchèvementQuery;

export type { ConsulterAchèvementQuery };

// ReadModel
export type { ConsulterAchèvementReadModel, ConsulterAchèvementAchevéReadModel };

// Entity
export { AchèvementEntity } from './achèvement.entity';

// ValueTypes
export * as DateAchèvementPrévisionnel from './dateAchèvementPrévisionnel.valueType';
export * as TypeTâchePlanifiéeAchèvement from './typeTâchePlanifiéeAchèvement.valueType';
export * as TypeDocumentAttestationConformité from './typeDocumentAttestationConformité.valueType';

// Event
export * from './achèvement.event';
export { DateAchèvementPrévisionnelCalculéeEvent } from './calculerDateAchèvementPrévisionnel/calculerDateAchèvementPrévisionnel.event';

export { AttestationConformitéTransmiseEvent } from './transmettre/transmettreAttestationConformité.event';
export { AttestationConformitéModifiéeEvent } from './modifier/modifierAttestationConformité.event';
