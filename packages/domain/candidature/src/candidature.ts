import type { CandidatureImportéeEvent } from './importer/importerCandidature.behavior';
import type { CandidatureCorrigéeEvent } from './corriger/corrigerCandidature.behavior';
import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/notifierCandidature.behavior';

// Events
export type CandidatureEvent =
  | CandidatureImportéeEvent
  | CandidatureCorrigéeEvent
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1;

export {
  CandidatureImportéeEvent,
  CandidatureCorrigéeEvent,
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
};

// Entity
export * from './candidature.entity';

// Value Types
export * as TypeTechnologie from './typeTechnologie.valueType';
export * as TypeActionnariat from './typeActionnariat.valueType';
export * as HistoriqueAbandon from './historiqueAbandon.valueType';
export * as StatutCandidature from './statutCandidature.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';

// Aggregate
export * as Aggregate from './candidature.aggregate';
