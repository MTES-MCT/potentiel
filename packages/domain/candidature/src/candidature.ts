import { ImporterCandidatureUseCase } from './importer/importerCandidature.usecase';
import type { CandidatureImportéeEvent } from './importer/importerCandidature.behavior';
import { CorrigerCandidatureUseCase } from './corriger/corrigerCandidature.usecase';
import type { CandidatureCorrigéeEvent } from './corriger/corrigerCandidature.behavior';
import { NotifierCandidatureUseCase } from './notifier/notifierCandidature.usecase';
import {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/notifierCandidature.behavior';

// UseCases
export type CandidatureUseCase =
  | ImporterCandidatureUseCase
  | CorrigerCandidatureUseCase
  | NotifierCandidatureUseCase;
export { ImporterCandidatureUseCase, CorrigerCandidatureUseCase, NotifierCandidatureUseCase };

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

// Register
export * from './register';

// Entity
export * from './projet.entity';
export * from './candidature.entity';

// Value Types
export * as TypeTechnologie from './typeTechnologie.valueType';
export * as TypeActionnariat from './typeActionnariat.valueType';
export * as HistoriqueAbandon from './historiqueAbandon.valueType';
export * as StatutCandidature from './statutCandidature.valueType';
export * as TypeGarantiesFinancières from './typeGarantiesFinancières.valueType';

// Aggregate
export * as Aggregate from './candidature.aggregate';
