import {
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
} from './consulter/consulterAchèvement.query';
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
export type AchèvementQuery = ConsulterAchèvementQuery | ConsulterAttestationConformitéQuery;

export type { ConsulterAchèvementQuery, ConsulterAttestationConformitéQuery };

// ReadModel
export type { ConsulterAchèvementReadModel, ConsulterAttestationConformitéReadModel };

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
