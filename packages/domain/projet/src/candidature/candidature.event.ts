import type {
  CandidatureCorrigéeEvent,
  CandidatureCorrigéeEventV1,
} from './corriger/candidatureCorrigée.event';
import type {
  CandidatureImportéeEvent,
  CandidatureImportéeEventV1,
  DétailsFournisseursCandidatureImportésEvent,
} from './importer/candidatureImportée.event';
import type {
  CandidatureNotifiéeEvent,
  CandidatureNotifiéeEventV1,
} from './notifier/candidatureNotifiée.event';

export type CandidatureEvent =
  | CandidatureImportéeEvent
  | CandidatureImportéeEventV1
  | DétailsFournisseursCandidatureImportésEvent
  | CandidatureCorrigéeEventV1
  | CandidatureCorrigéeEvent
  | CandidatureNotifiéeEvent
  | CandidatureNotifiéeEventV1;
