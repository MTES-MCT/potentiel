import {
  ConsulterAchèvementAchevéReadModel,
  ConsulterAchèvementQuery,
  ConsulterAchèvementReadModel,
} from './consulter/consulterAchèvement.query';
import {
  ListerAchèvementEnAttenteQuery,
  ListerAchèvementEnAttenteReadModel,
} from './lister/listerAchèvementEnAttente.query';
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
export type AchèvementQuery = ConsulterAchèvementQuery | ListerAchèvementEnAttenteQuery;

export type { ConsulterAchèvementQuery, ListerAchèvementEnAttenteQuery };

// ReadModel
export type {
  ConsulterAchèvementReadModel,
  ConsulterAchèvementAchevéReadModel,
  ListerAchèvementEnAttenteReadModel,
};

// Entity
export { AchèvementEntity } from './achèvement.entity';

// ValueTypes
export * as DateAchèvementPrévisionnel from './dateAchèvementPrévisionnel.valueType';
export * as TypeTâchePlanifiéeAchèvement from './typeTâchePlanifiéeAchèvement.valueType';
export * as TypeDocumentAttestationConformité from './typeDocumentAttestationConformité.valueType';

// Event
export * from './achèvement.event';
